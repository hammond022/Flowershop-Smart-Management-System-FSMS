<!-- idk what the fuck this is  -->

<script setup></script>

<template>
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
          <h5 class="modal-title" id="editItemModalLabel">Quick Create</h5>
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
            />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text">Price</span>
            <span class="input-group-text">₱</span>
            <input type="text" class="form-control" />
            <button type="button" class="btn btn-outline-primary">-</button>
            <button type="button" class="btn btn-outline-primary">+</button>
          </div>

          <div class="mb-3">
            <div class="input-group">
              <span class="input-group-text">Tags</span>
              <input
                type="text"
                class="form-control"
                placeholder="ex. Birthday, Happy"
                disabled
              />
            </div>
            <div class="form-text">Separate tags by space or comma.</div>
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
          <button type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
