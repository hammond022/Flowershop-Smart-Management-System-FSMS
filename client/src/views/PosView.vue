<!-- im so sorry about this being so poorly written -->
<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { Modal, Toast } from "bootstrap";
import CurrentUser from "@/components/POS/CurrentUser.vue";
import Categories from "@/components/POS/Categories.vue";
import Items from "@/components/POS/Items.vue";
import PosBottomBar from "@/components/POS/PosBottomBar.vue";
// import QuantityAdjuster from "@/components/QuantityAdjuster.vue";

const selectedFlowers = ref([]);
function onFlowerSelect(flower) {
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
let editItemModal;
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

onMounted(() => {
  editItemModal = new Modal(document.getElementById("editItemModal"));
});
</script>

<template>
  <div class="container-fluid">
    <div class="row h-100">
      <div class="col-4">
        <CurrentUser />

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
      </div>

      <div class="col">
        <div class="row"><Categories /><Items @select="onFlowerSelect" /></div>
      </div>
    </div>
  </div>
  <PosBottomBar />
  <!-- modal -->
  <div
    class="modal fade"
    id="editItemModal"
    tabindex="-1"
    aria-labelledby="editItemModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editItemModalLabel">Edit Item</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
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
</template>
