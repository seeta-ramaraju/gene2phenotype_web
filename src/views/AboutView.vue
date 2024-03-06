<script>
    export default {
        methods: {
            changeColor(refName) {
            // Access the button element using $refs
                this.$nextTick(() => {
                    let button = this.$refs[refName];
                    button.style.backgroundColor = 'blue';
                });
            }
        }
    };
</script>
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
                        <button ref="myButton1" @click="changeColor('myButton1')">
                            <router-link to="/about/project" class="nav-link active" aria-current="page">
                                The Project
                            </router-link>
                        </button>
                    </div>
                </li>
                <li class="nav_item" style="display : inline-block; margin-right: 30px;">
                    <div class="box" style="border : 2px solid black;">
                        <button ref="myButton2" @click="changeColor('myButton2')">
                            <router-link to="/about/terminology" class="nav-link active" aria-current="page">
                                Terminology
                            </router-link>
                        </button>
                    </div>
                </li>
                <li class="nav_item" style="display : inline-block; margin-right: 30px;">
                    <div class="box" style="border : 2px solid black;">
                        <button ref="myButton3" @click="changeColor('myButton3')">
                            <router-link to="/about/variant-filtering" class="nav-link active" aria-current="page">
                                Variant Filtering
                            </router-link>
                        </button>
                    </div>
                </li>
                <li class="nav_item" style="display : inline-block;">
                    <div class="box" style="border : 2px solid black;">
                        <button ref="myButton4" @click="changeColor('myButton4')">
                            <router-link to="/publications" class="nav-link active" aria-current="page">
                                Publications
                            </router-link>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
      </div>
    </div>
  </div>
</template>