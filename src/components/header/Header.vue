<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <img src="../../assets/G2P-logo.png" alt="G2P logo" width="30" height="30"
          class="d-inline-block align-text-top" />
        Gene2Phenotype
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
          </li>
          <li class="nav-item dropdown">
            <span class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              About
            </span>
            <ul class="dropdown-menu">
              <li>
                <router-link to="/about/project" class="dropdown-item">
                  The Project
                </router-link>
              </li>
              <li><a class="dropdown-item" href="#">Terminology</a></li>
              <li><a class="dropdown-item" href="#">Variant filtering</a></li>
              <li>
                <router-link to="/publications" class="dropdown-item">Publications</router-link>
              </li>
              <li><a class="dropdown-item" href="#">Announcements</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Browse
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">All panels</a></li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li><a class="dropdown-item" href="#">Cancer panel</a></li>
              <li><a class="dropdown-item" href="#">Eye panel</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Curate</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Add new G2P record</a></li>
              <li><router-link to="/curation/entries" class="dropdown-item">Saved Drafts</router-link></li>

            </ul>
          </li>
        </ul>

        <div class="input-group ms-auto me-auto" style="max-width: 75%">
          <input type="text" class="form-control" aria-label="Text input with dropdown button"
            placeholder="Eg: CRYBA1 or Severe Neurodevelopmental Syndrome" />
          <select class="form-select" aria-label="Default select example" style="max-width: 22%">
            <option selected>Search by Gene</option>
            <option value="1">Search by Disease</option>
            <option value="2">Search by Phenotype</option>
          </select>
          <select class="form-select" aria-label="Default select example" style="max-width: 22%">
            <option selected>Search all panels</option>
            <option value="1">Search Cancer panel</option>
            <option value="2">Search Eye panel</option>
          </select>
          <button type="button" class="btn btn-primary">
            <i class="bi bi-search"></i>
          </button>
        </div>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="#">Log In</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
