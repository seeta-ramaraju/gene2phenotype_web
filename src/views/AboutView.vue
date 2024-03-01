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
        <div>
            <ul class="navbar-nav mb-2 mb-lg-0" style="display : inline-block;">
                <li class="nav-item"  style="display : inline-block; margin-right: 30px;" >
                    <div class="box" style="border : 2px solid black;">
                        <router-link to="/about/project" class="nav-link active" aria-current="page">
                            The Project
                        </router-link>
                    </div>
                </li>
                <li class="nav_item" style="display : inline-block; margin-right: 30px;">
                    <div class="box" style="border : 2px solid black;">
                        <router-link to="/about/terminology" class="nav-link active" aria-current="page">
                            Terminology
                        </router-link>
                    </div>
                </li>
                <li class="nav_item" style="display : inline-block; margin-right: 30px;">
                    <div class="box" style="border : 2px solid black;">
                        <router-link to="/about/variant-filtering" class="nav-link active" aria-current="page">
                            Variant Filtering
                        </router-link>
                    </div>
                </li>
                <li class="nav_item" style="display : inline-block;">
                    <div class="box" style="border : 2px solid black;">
                        <router-link to="/publications" class="nav-link active" aria-current="page">
                            Publications
                        </router-link>
                    </div>
                </li>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>