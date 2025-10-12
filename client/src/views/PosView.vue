<!-- im so sorry about this being so poorly written -->
<!-- day 9 shit on top of dried shit -->
<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { Modal, Toast } from "bootstrap";
import CurrentUser from "@/components/POS/CurrentUser.vue";
import Categories from "@/components/POS/Categories.vue";
import Items from "@/components/POS/Items.vue";
import BottomBar from "@/components/POS/BottomBar.vue";
import Draft from "@/components/POS/Draft.vue";
import OrderService from "@/router/api/ordersService";
import ItemService from "@/router/api/itemsService"; // ✅ Add this

// import QuantityAdjuster from "@/components/QuantityAdjuster.vue";

// currently not using the selectedFlowers here,
//!todo migrate selectedFlowers(ref) to order(reactive)

const selectedCategory = ref("all");
const categories = ref([]);
const allItems = ref([]);

const discounts = ref([]);

const order = reactive({
  orderStart: "",
  orderEnd: "",
  orderStatus: "",
  selectedFlowers: [],
  actionHistory: [],
  draftTitle: "",
});
const selectedFlowers = ref([]);
function onFlowerSelect(flower) {
  if (!order.orderStart) {
    order.orderStart = new Date();
  }
  const alreadyExist = selectedFlowers.value.find((f) => f.id === flower.id);
  if (alreadyExist) {
    alreadyExist.qty += 1;
  } else {
    selectedFlowers.value.push({
      ...flower,
      qty: 1,
      oldPrice: flower.price,
      notes: "",
    });
  }
}

async function loadItems() {
  try {
    const items = await ItemService.getItems();
    allItems.value = items;
    const unique = [
      ...new Set(
        items
          .map((i) => i.category?.toLowerCase().trim())
          .filter((c) => c && c.length > 0)
      ),
    ];
    categories.value = ["all", ...unique];
  } catch (err) {
    console.error("Error loading items:", err.message);
  }
}

function handleCategorySelect(category) {
  selectedCategory.value = category;
}

const total = computed(() =>
  selectedFlowers.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);

const totalAfterDiscount = computed(() => {
  const subtotal = selectedFlowers.value.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (discounts.value.length === 0) return subtotal;

  const totalDiscount = discounts.value.reduce((sum, d) => {
    if (d.type === "amount") return sum + d.value;
    if (d.type === "percent") return sum + (subtotal * d.value) / 100;
    return sum;
  }, 0);

  return Math.max(subtotal - totalDiscount, 0);
});

const hasInvalidStock = computed(() => {
  return selectedFlowers.value.some((item) => item.qty > item.stock);
});

// kaawaan nawa ako ng diyos
function removeOne(id) {
  const index = selectedFlowers.value.findIndex((f) => f.id === id);
  if (index === -1) return;

  const flower = selectedFlowers.value[index];
  if (flower.qty > 1) {
    flower.qty -= 1;
  } else {
    selectedFlowers.value.splice(index, 1);
  }
}
const editModal = reactive({
  id: null,
  name: "",
  price: 0,
  qty: 0,
  notes: "test",
  oldPrice: null,
});
function resetModal() {}

function editItem(id) {
  const index = selectedFlowers.value.findIndex((f) => f.id === id);
  const flower = selectedFlowers.value[index];
  editModal.id = id;
  editModal.name = flower.name;
  editModal.price = flower.price;
  editModal.qty = flower.qty;
  editModal.oldPrice = flower.oldPrice;
  editModal.notes = flower.notes;

  resetModal();
  editItemModal.show();
}

function saveEditModal() {
  const index = selectedFlowers.value.findIndex((f) => f.id === editModal.id);
  if (index === -1) return;
  const item = selectedFlowers.value[index];

  item.price = Number(editModal.price);
  item.qty = Number(editModal.qty);
  item.notes = editModal.notes;
  editItemModal.hide();
}

function cancelOrder() {
  cancelOrderModal.show();
}

function orderCheckout() {
  orderCheckoutModal.show();
  // !todo fix how the modal appears, accordion sometimes collapsed when opened + other things
}

function saveAsDraft() {
  draftModal.show();
}

function addDiscount() {
  addDiscountModal.show();
}

function confirmDiscount() {
  if (discount.value <= 0) return;

  discounts.value.push({ value: discount.value, type: discount.type });

  discount.value = 0;
  discount.type = "amount";
  addDiscountModal.hide();
}

function resetOrder() {
  order.orderStart = "";
  order.orderEnd = "";
  order.orderStatus = "";
  order.selectedFlowers = [];
  order.actionHistory = [];
  selectedFlowers.value = [];
  discounts.value = [];
}

function voidOrder() {
  resetOrder();
  cancelOrderModal.hide();
  toastInstance.show();
}

async function confirmAsDraft() {
  try {
    await OrderService.createOrder({
      orderStart: order.orderStart,
      orderEnd: "",
      orderStatus: "Draft",
      selectedFlowers: selectedFlowers.value.map((f) => ({ ...f })),
      actionHistory: [...order.actionHistory, order.draftTitle],
      discounts: discounts.value.map((d) => ({ ...d })),
      total: totalAfterDiscount.value,
    });
    await getDraftOrders();
  } catch (err) {
    console.error(err.message || "creating draft failed");
  } finally {
    draftModal.hide();
    resetOrder();
  }
}

function confirmCheckout() {
  try {
    if (totalAfterDiscount.value <= 0) {
      alert("Discount exceeds total amount!");
      return;
    }

    OrderService.createOrder({
      orderStart: order.orderStart,
      orderEnd: new Date().toISOString(),
      orderStatus: "Completed",
      selectedFlowers: selectedFlowers.value.map((f) => ({ ...f })),
      discounts: discounts.value.map((d) => ({ ...d })),
      total: totalAfterDiscount.value,
      actionHistory: order.actionHistory,
    });
  } catch (err) {
    console.error(err.message || "checkout failed");
  }
  orderCheckoutModal.hide();
  resetOrder();
  toastInstance.show();
}

const draftOrders = ref([]);

async function getDraftOrders() {
  try {
    const drafts = await OrderService.getOrders({ status: "Draft" });
    console.log(drafts);
    draftOrders.value = drafts;
  } catch (err) {
    console.error("Error fetching draft orders:", err.message);
  }
}

// mortal sin - will fix this eventually
function increaseQty(amount = 1) {
  editModal.qty = Number(editModal.qty) + amount;
}

function decreaseQty(amount = 1) {
  if (editModal.qty - amount >= 1) {
    editModal.qty = Number(editModal.qty) - amount;
  }
}

function increasePrice(amount = 10) {
  editModal.price = Number(editModal.price) + amount;
}

function decreasePrice(amount = 10) {
  if (editModal.price - amount >= 0) {
    editModal.price = Number(editModal.price) - amount;
  }
}

const discount = reactive({
  value: 0,
  type: "amount", // or "percent"
});

function increaseDiscount(amount = 10) {
  discount.value += discount.type === "amount" ? amount : 1;
}

function decreaseDiscount(amount = 10) {
  const step = discount.type === "amount" ? amount : 1;
  discount.value = Math.max(0, discount.value - step);
}

function removeDiscount(index) {
  discounts.value.splice(index, 1);
}

let draftModal;
let editItemModal;
let cancelOrderModal;
let orderCheckoutModal;
let addDiscountModal;
let toastInstance;
onMounted(async () => {
  draftModal = new Modal(document.getElementById("draftModal"));
  editItemModal = new Modal(document.getElementById("editItemModal"));
  cancelOrderModal = new Modal(document.getElementById("cancelOrderModal"));
  orderCheckoutModal = new Modal(document.getElementById("orderCheckoutModal"));
  addDiscountModal = new Modal(document.getElementById("addDiscountModal"));
  toastInstance = new Toast(document.getElementById("myToast"), {
    delay: 3000,
    autohide: true,
  });
  await getDraftOrders();
  await loadItems();
});
</script>

<template>
  <div class="container-fluid h-100">
    <div class="col d-flex flex-column h-100">
      <div class="row">
        <div
          class="border border-secondary border-opacity-25 rounded d-flex flex-column mt-3 ms-3 justify-content-between shadow-lg"
          style="width: 40%; height: 90vh"
        >
          <div>
            <div
              v-if="hasInvalidStock"
              class="mt-3 alert alert-danger"
              role="alert"
            >
              This is an impossible order to fulfill!
            </div>

            <CurrentUser
              :orderStart="
                order.orderStart ? order.orderStart.toLocaleString() : ''
              "
            />
            <div
              class="d-flex flex-column"
              style="max-height: 55vh; overflow-y: auto"
            >
              <div id="drafts" v-if="!order.orderStart">
                <h2>Draft orders</h2>
                <Draft
                  v-for="item in draftOrders"
                  :key="item.id"
                  :draft="item"
                  @delete-draft="getDraftOrders()"
                />
                <p v-if="draftOrders.length === 0" class="text-center">
                  There are no draft orders
                </p>
              </div>
              <div id="cart">
                <ul class="list-group">
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center"
                    v-for="item in selectedFlowers"
                    :key="item.id"
                  >
                    {{ item.name }} - ₱{{ item.price }}
                    <div>
                      <span
                        class="badge text-bg-secondary rounded-pill me-3"
                        v-if="item.qty > 1"
                        >{{ item.qty }}</span
                      >
                      <div class="btn-group">
                        <button
                          type="button"
                          class="btn btn-outline-primary"
                          @click="editItem(item.id)"
                        >
                          <i class="bi bi-pencil-square"></i></button
                        ><button
                          type="button"
                          class="btn btn-outline-danger"
                          @click="removeOne(item.id)"
                        >
                          -
                        </button>
                      </div>
                    </div>
                  </li>

                  <li
                    v-for="(discount, index) in discounts"
                    :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                  >
                    <div>
                      <span class="badge text-bg-primary me-2">
                        {{
                          discount.type === "amount"
                            ? `₱${discount.value} off`
                            : `${discount.value}% off`
                        }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="btn-close"
                      @click="removeDiscount(index)"
                      aria-label="Remove"
                    ></button>
                  </li>

                  <li
                    class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                    v-if="total > 0"
                  >
                    <span>Subtotal:</span>
                    <span class="badge text-bg-secondary">₱{{ total }}</span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                    v-if="discounts.length > 0"
                  >
                    <span>Discount total:</span>
                    <span class="badge text-bg-primary"
                      >₱{{
                        discounts.reduce((sum, d) => {
                          return (
                            sum +
                            (d.type === "amount"
                              ? d.value
                              : (total * d.value) / 100)
                          );
                        }, 0)
                      }}
                    </span>
                  </li>
                  <li
                    class="list-group-item d-flex justify-content-between align-items-center fw-bold list-group-item-success"
                    v-if="totalAfterDiscount < total"
                  >
                    <span>Total after discount:</span>
                    <span>₱{{ totalAfterDiscount }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <BottomBar
            :selected-flowers="selectedFlowers"
            :order-started="
              order.orderStart ? order.orderStart.toLocaleString() : ''
            "
            :total="totalAfterDiscount"
            :has-invalid-stock="hasInvalidStock"
            @orderCheckout="orderCheckout"
            @saveAsDraft="saveAsDraft"
            @cancelOrder="cancelOrder"
            @addDiscount="addDiscount"
          />
        </div>

        <Categories
          style="width: 15%"
          :categories="categories"
          :selected-category="selectedCategory"
          @select-category="handleCategorySelect"
        />

        <Items
          style="width: 40%"
          :all-items="allItems"
          :selected-category="selectedCategory"
          @select="onFlowerSelect"
        />
      </div>
    </div>
  </div>

  <!-- modal -->
  <!-- should modals be reusable components? idk -->
  <div class="modal fade" id="editItemModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editItemModalLabel">Edit Item</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <div class="modal-body">
          <div class="input-group mb-3">
            <span class="input-group-text">Name</span>
            <input
              type="text"
              class="form-control"
              placeholder="ex. Transvaal daisy"
              disabled
              readonly
              v-model="editModal.name"
            />
          </div>

          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text">Quantity</span>
              <input
                type="text"
                class="form-control"
                v-model.number="editModal.qty"
              />
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="decreaseQty()"
              >
                -
              </button>
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="increaseQty()"
              >
                +
              </button>
            </div>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Price</span>
            <span class="input-group-text">Per item</span>
            <span class="input-group-text">₱</span>
            <input
              type="text"
              class="form-control"
              v-model.number="editModal.price"
            />
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="decreasePrice()"
            >
              -
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="increasePrice()"
            >
              +
            </button>
          </div>

          <div class="form-text" v-if="editModal.oldPrice != editModal.price">
            Price has been edited, original price ₱{{ editModal.oldPrice }}
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Notes</span>
            <textarea
              class="form-control"
              placeholder="ex. Customer notes"
              aria-label="With textarea"
              v-model="editModal.notes"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="saveEditModal()"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="cancelOrderModal" class="modal fade" tabindex="-1 ">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Void current order</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            Order created:
            {{ order.orderStart ? order.orderStart.toLocaleString() : "" }}
          </p>
          <div
            class="accordion mb-3"
            id="accordionExample"
            v-if="selectedFlowers.length"
          >
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Items
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="item in selectedFlowers"
                      :key="item.id"
                    >
                      {{ item.qty }}x {{ item.name }}
                      <div>
                        <span>₱{{ item.price }}</span>
                      </div>
                    </li>

                    <li
                      class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                    >
                      Total:
                      <span>₱{{ total }}</span>
                    </li>
                  </ul>

                  <!--  -->
                </div>
              </div>
            </div>
          </div>
          <h2 class="text-center" v-if="!selectedFlowers.length">
            Empty Order
          </h2>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-danger" @click="voidOrder">
            Void order
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="orderCheckoutModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Order</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            Order created:
            {{ order.orderStart ? order.orderStart.toLocaleString() : "" }}
          </p>
          <div class="accordion mb-3" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Items
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="item in selectedFlowers"
                      :key="item.id"
                    >
                      {{ item.qty }}x {{ item.name }}
                      <div>
                        <span>₱{{ item.price }}</span>
                      </div>
                    </li>
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                      v-if="discounts.length > 0"
                    >
                      <span>Discount total:</span>
                      <span class="badge text-bg-primary"
                        >₱{{
                          discounts.reduce((sum, d) => {
                            return (
                              sum +
                              (d.type === "amount"
                                ? d.value
                                : (total * d.value) / 100)
                            );
                          }, 0)
                        }}
                      </span>
                    </li>

                    <li
                      class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                    >
                      Total:
                      <span>₱{{ totalAfterDiscount }}</span>
                    </li>
                  </ul>

                  <!--  -->
                </div>
              </div>
            </div>
          </div>
          <label for="">Payment Method</label>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="radioDefault"
              id="payment-cash"
              checked
            />
            <label class="form-check-label" for="payment-cash"> Cash </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="radioDefault"
              id="payment-other"
              disabled
            />
            <label class="form-check-label" for="payment-other">
              Bank Transfer/E-Wallet
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
            Cancel
          </button>
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-success"
              @click="confirmCheckout"
            >
              Confirm Checkout
            </button>
            <button
              type="button"
              class="btn btn-success dropdown-toggle dropdown-toggle-split"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            ></button>
            <ul class="dropdown-menu">
              <li class="">
                <a class="dropdown-item" href="#" @click="draftOrder"
                  >Save as draft</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="draftModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Save order as draft</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Order created: {{ order.orderStart.toLocaleString() }}</p>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              v-model="order.draftTitle"
            />
            <label for="floatingInput">Draft title</label>
          </div>
          <div class="accordion mb-3" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Items
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  <ul class="list-group list-group-flush">
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="item in selectedFlowers"
                      :key="item.id"
                    >
                      {{ item.qty }}x {{ item.name }}
                      <div>
                        <span>₱{{ item.price }}</span>
                      </div>
                    </li>

                    <li
                      class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                      v-if="discounts.length > 0"
                    >
                      <span>Discount total:</span>
                      <span class="badge text-bg-primary"
                        >₱{{
                          discounts.reduce((sum, d) => {
                            return (
                              sum +
                              (d.type === "amount"
                                ? d.value
                                : (total * d.value) / 100)
                            );
                          }, 0)
                        }}
                      </span>
                    </li>

                    <li
                      class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                    >
                      Total:
                      <span>₱{{ totalAfterDiscount }}</span>
                    </li>
                  </ul>

                  <!--  -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="confirmAsDraft">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="addDiscountModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add discount</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label fw-bold">Discount Type</label>
            <div class="btn-group w-100" role="group">
              <input
                type="radio"
                class="btn-check"
                name="discountType"
                id="discountAmount"
                value="amount"
                v-model="discount.type"
              />
              <label class="btn btn-outline-primary" for="discountAmount"
                >₱ Amount</label
              >

              <input
                type="radio"
                class="btn-check"
                name="discountType"
                id="discountPercent"
                value="percent"
                v-model="discount.type"
              />
              <label class="btn btn-outline-primary" for="discountPercent"
                >% Percent</label
              >
            </div>
          </div>

          <div class="input-group mb-3 mt-3">
            <span class="input-group-text">Value</span>
            <span class="input-group-text">{{
              discount.type === "amount" ? "₱" : "%"
            }}</span>
            <input
              type="number"
              class="form-control"
              v-model.number="discount.value"
              min="0"
            />
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="decreaseDiscount()"
            >
              -
            </button>
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="increaseDiscount()"
            >
              +
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="confirmDiscount"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- toast -->
  <div
    id="myToast"
    class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 p-3 m-3 shadow-sm"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">Successfully created product</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>
