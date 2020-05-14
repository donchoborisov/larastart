<template>
    <div class="container">
          <div class="mt-5" v-if="$gate.isAdminOrAuthor()">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Users management</h3>

                    <div class="card-tools">
                      <button class="btn btn-success" @click="newModal">Add New <i class="fas fa-user-plus fa-fw"></i> </button>
                    </div>
                </div>
                <!-- /.card-header -->
                <div class="card-body table-responsive p-0">
                    <table class="table table-hover text-nowrap">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Registered at</th>
                            <th>Modify</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="user in users.data" :key="user.id">
                            <td>{{user.id}}</td>
                            <td>{{user.name}}</td>
                            <td>{{user.email}}</td>
                            <td>{{user.type | upText}}</td>
                            <td>{{user.created_at | myDate}}</td>

                            <td>
                             <a href="#" @click="editModal(user)">
                                 <i class="fa fa-edit blue"></i>
                             </a>
                                <a href="#" @click="deleteUser(user.id)">
                                    <i class="fa fa-trash red"></i>
                                </a>
                            </td>
                        </tr>



                        </tbody>
                    </table>
                </div>
                <div class="card-footer">
                    <pagination :data="users" @pagination-change-page="getResults"></pagination>
                </div>
                <!-- /.card-body -->
            </div>
            <!-- /.card -->
        </div>
          </div>

        <div  v-if="!$gate.isAdminOrAuthor()">

            <not-found></not-found>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 v-show="!editmode" class="modal-title" id="addNew">Add New</h5>

                        <h5 v-show="editmode"class="modal-title" id="addNew">Update User info</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editmode ? updateUser() : createUser()">
                    <div class="modal-body">
                        <div class="form-group">

                            <input v-model="form.name" type="text" name="name" placeholder="name"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                            <has-error :form="form" field="name"></has-error>
                        </div>
                        <div class="form-group">

                            <input v-model="form.email" type="email" name="email" placeholder="email"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                            <has-error :form="form" field="email"></has-error>
                        </div>
                        <div class="form-group">

                            <textarea v-model="form.bio"  name="bio" placeholder="bio" id="bio"
                                      class="form-control" :class="{ 'is-invalid': form.errors.has('email') }"></textarea>
                            <has-error :form="form" field="bio"></has-error>
                        </div>
                        <div class="form-group">

                            <select v-model="form.type"  name="type" placeholder="type" id="type"
                                      class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                <option value="">-Select User Role-</option>
                                <option value="admin">Admin</option>
                                <option value="user">Standard user</option>
                                <option value="author">Author</option>

                            </select>
                            <has-error :form="form" field="type"></has-error>
                        </div>
                        <div class="form-group">

                            <input v-model="form.password" type="password" name="password" placeholder="password"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                            <has-error :form="form" field="password"></has-error>
                        </div>


                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button v-show="editmode" type="submit" class="btn btn-success">Edit</button>
                        <button v-show="!editmode"type="submit" class="btn btn-primary">Create</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>

    </div>


</template>

<script>
    export default {
        name: "Users",
        data(){
            return{
                editmode:false,
                users:{},
                form:new Form({
                    id:'',
                    name:'',
                    email:'',
                    password:'',
                    type:'',
                    bio:'',
                    photo:''

                })

            }
        },
        methods:{

            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },

            updateUser(){
             this.$Progress.start();
             this.form.put('api/user/'+this.form.id)
                .then(() => {
                    $('#addNew').modal('hide');
                    swal.fire(
                        'Updated',
                        'Information has been updated.',
                        'success'
                    )
                    Fire.$emit('AfterCreate')
                })
                .catch(()=>{

                    swal.fire("Failed", "There was something wrong", "warning");

                });
            },
            editModal(user){
                this.editmode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },
            newModal(){
                this.editmode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            deleteUser(id){
                swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {

                        //send request
                    if(result.value) {
                        this.form.delete('api/user/' + id)
                            .then(() => {

                                swal.fire(
                                    'Deleted!',
                                    'Your file has been deleted.',
                                    'success'
                                )
                                Fire.$emit('AfterCreate')
                            })
                            .catch(() => {

                                swal("Failed", "There was something wrong", "warning");

                            });
                    }
                })
            },
            createUser(){
          this.$Progress.start();
          this.form.post('api/user')
          .then(
              ()=>{
                  Fire.$emit('AfterCreate');

                  $('#addNew').modal('hide')

                  toast.fire({
                      icon: 'success',
                      title: 'User created successfully'
                  });

                  this.$Progress.finish();

              }
          )
          .catch(


          );

           },
            loadUsers(){

                if(this.$gate.isAdminOrAuthor()) {
                    axios.get('api/user').then(({ data }) => (this.users = data));
                }

            },

        },
        created() {

            Fire.$on('searching',()=>{
                 let query = this.$parent.search;
                 axios.get('api/findUser?q=' + query)
                .then((data) => {
                    this.users = data.data
                })
                .catch(()=>{

                });

            })

            this.loadUsers();
            //setInterval(()=>this.loadUsers(),3000);
            Fire.$on('AfterCreate',()=>{
                 this.loadUsers();
            });
        }

    }
</script>

<style scoped>

</style>
