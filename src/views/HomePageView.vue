<template>
  <div class="container px-5">
    <div class="row py-3">
      <div class="col-2">
        <img
          alt="G2P logo"
          src="../assets/G2P-logo.png"
          width="80%"
          height="auto"
        />
      </div>
      <div class="col-10" style="vertical-align: middle">
        <h3>Gene2Phenotype (G2P)</h3>
        <h5>
          Accelerating diagnostic variant filtering with high-confidence
          evidence-based gene-disease models
        </h5>
      </div>
    </div>
    <div class="input-group">
      <input
        type="text"
        class="form-control"
        aria-label="Text input with segmented dropdown button"
        placeholder="Eg: CRYBA1 or Severe Neurodevelopmental Syndrome"
      />
      <select
        class="form-select"
        aria-label="Default select example"
        style="max-width: 18%"
      >
        <option selected>Search by Gene</option>
        <option value="1">Search by Disease</option>
        <option value="2">Search by Phenotype</option>
      </select>
      <select
        class="form-select"
        aria-label="Default select example"
        style="max-width: 18%"
      >
        <option selected>Search all panels</option>
        <option value="1">Search Cancer panel</option>
        <option value="2">Search Eye panel</option>
      </select>
      <button type="button" class="btn btn-primary">
        <i class="bi bi-search"></i>
      </button>
    </div>
    <div class="row py-4">
      <h5>Explore by Disorder Panel</h5>
    </div>
    <div class="row mx-5">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">Disorder Panel</th>
            <th scope="col">Number of Entries</th>
            <th scope="col">Last Update</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sample Panel</td>
            <td>0</td>
            <td>30th January 2024</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row py-4">
      <h5>Announcements</h5>
    </div>
    <div class="row pb-4 mx-5">
      <div class="card" style="width: 18rem">
        <div class="card-body">
          <h5 class="card-title">Announcement title</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">Date</h6>
          <p class="card-text">Announcement text.</p>
          <a href="#" class="card-link">Read more</a>
        </div>
      </div>
    </div>
  </div>
</template>
