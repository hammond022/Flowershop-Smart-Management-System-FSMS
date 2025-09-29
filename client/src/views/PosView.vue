<!-- im so sorry about this being so poorly written -->
<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { Modal, Toast } from "bootstrap";
import CurrentUser from "@/components/POS/CurrentUser.vue";
import Categories from "@/components/POS/Categories.vue";
import Items from "@/components/POS/Items.vue";
import BottomBar from "@/components/POS/BottomBar.vue";
import Draft from "@/components/POS/Draft.vue";
import OrderService from "@/router/api/ordersService";
// import QuantityAdjuster from "@/components/QuantityAdjuster.vue";

// currently not using the selectedFlowers here,
//!todo migrate selectedFlowers(ref) to order(reactive)

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
const total = computed(() =>
  selectedFlowers.value.reduce((sum, item) => sum + item.price * item.qty, 0)
);
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

function resetOrder() {
  order.orderStart = "";
  order.orderEnd = "";
  order.orderStatus = "";
  order.selectedFlowers = [];
  order.actionHistory = [];
  selectedFlowers.value = [];
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
    OrderService.createOrder({
      orderStart: order.orderStart,
      orderEnd: new Date().toISOString(),
      orderStatus: "Completed",
      selectedFlowers: selectedFlowers.value.map((f) => ({ ...f })),
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
let draftModal;
let editItemModal;
let cancelOrderModal;
let orderCheckoutModal;
let toastInstance;
onMounted(async () => {
  draftModal = new Modal(document.getElementById("draftModal"));
  editItemModal = new Modal(document.getElementById("editItemModal"));
  cancelOrderModal = new Modal(document.getElementById("cancelOrderModal"));
  orderCheckoutModal = new Modal(document.getElementById("orderCheckoutModal"));
  toastInstance = new Toast(document.getElementById("myToast"), {
    delay: 3000,
    autohide: true,
  });
  await getDraftOrders();
});
</script>

<template>
  <div class="container-fluid">
    <div class="row h-100">
      <div class="col-4 d-flex flex-column" style="max-height: 80vh">
        <CurrentUser :orderStart="order.orderStart.toLocaleString()" />
        <div v-if="!order.orderStart" class="overflow-y-auto">
          <h2>Draft orders</h2>
          <Draft
            v-for="item in draftOrders"
            :key="item.id"
            :draft="item"
            @delete-draft="getDraftOrders()"
          />
          <p class="text-center">
            <a href="#" class="link-underline-primary">Show more drafts...</a>
          </p>
        </div>

        <!-- this could be turned into a component in the future -->
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
            class="list-group-item d-flex justify-content-end align-items-center fw-bold"
            v-if="total > 0"
          >
            <span class="badge text-bg-success">Total: ₱{{ total }}</span>

            <!-- example only -->
          </li>
          <!-- <li
            class="list-group-item d-flex justify-content-end align-items-center fw-bold"
          >
            <span class="badge text-bg-danger">Tax: P10</span>
          </li> -->
        </ul>
        <!-- <Draft /> -->
        <BottomBar
          class="mt-auto"
          :selected-flowers="selectedFlowers"
          :order-started="order.orderStart.toLocaleString()"
          :total="total"
          @orderCheckout="orderCheckout"
          @saveAsDraft="saveAsDraft"
          @cancelOrder="cancelOrder"
        />
      </div>

      <div class="col">
        <div class="row"><Categories /> <Items @select="onFlowerSelect" /></div>
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
              <input type="text" class="form-control" v-model="editModal.qty" />
              <button type="button" class="btn btn-outline-primary">-</button>
              <button type="button" class="btn btn-outline-primary">+</button>
            </div>
          </div>
          <div class="input-group mb-3">
            <span class="input-group-text">Price</span>
            <span class="input-group-text">Per item</span
            ><span class="input-group-text">₱</span>
            <input type="text" class="form-control" v-model="editModal.price" />

            <button type="button" class="btn btn-outline-primary">-</button>
            <button type="button" class="btn btn-outline-primary">+</button>
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
          <p>Order created: {{ order.orderStart.toLocaleString() }}</p>
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
          <p>Order created: {{ order.orderStart.toLocaleString() }}</p>
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
