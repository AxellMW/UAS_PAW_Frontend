<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Profile </h3>
        <v-card height="100%" width="50%" class="mx-auto">
            <v-btn small class="mr-2" @click="editHandler()"> edit </v-btn>
            <v-spacer></v-spacer>
            <span class="headline justify-start">Nama Pengguna: {{ userName }}</span>
            <v-spacer></v-spacer>
            <span class="headline justify-start">Email Pengguna: {{ userEmail }}</span>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Profile User</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.name" label="Nama" required></v-text-field>
                        <v-text-field v-model="form.email" label="Email" disabled required></v-text-field>
                        <v-text-field v-model="form.password" type="password" label="Password" required></v-text-field>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">Warning!</span>
                </v-card-title>
                <v-card-text>
                    Anda Yakin ingin menghapus kelas ini?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data() {
        return {
            inputType: 'Tambah',
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            search: null,
            dialog: false,
            dialogConfirm: false,
            userId: localStorage.getItem('id'),
            userName: localStorage.getItem('name'),
            userEmail: localStorage.getItem('email'),
            headers: [
                {
                    text: "Nama",
                    align: "start",
                    sortable: true,
                    value: "name",
                },
                { text: "Email", value: "email" },
                { text: "Password", value: "password" },
                { text: "Actions", value: "actions" },
            ],
            user: new FormData,
            users: [],
            form: {
                name: null,
                email: null,
                password: null,
            },
            deleteId: '',
            editId: ''
        };
    },
    methods: {
        setForm(){
            if(this.inputType !== 'Tambah'){
                this.update();
            }else{
                this.save();
            }
        },
        readData() {
            var url = this.$api + '/user';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.users = response.data.data;
            })
        },
        save() {
            this.user.append('name', this.form.name);
            this.user.append('email', this.form.email);
            this.user.append('password', this.form.password);

            var url = this.$api + '/user/'
            this.load = true;
            this.$http.post(url, this.user, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readData();
                this.resetForm();
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        update(){
            let newData = {
                name : this.form.name,
                email : this.form.email,
                password : this.form.password
            };
            this.userName = this.form.name;
            var url = this.$api + '/user/' + this.editId;
            this.load = true;
            this.$http.put(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        deleteData(){
            var url = this.$api + '/user/' + this.deleteId;
            this.load = true;
            this.$http.delete(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readData();
                this.resetForm();
                this.inputType = "Tambah";
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editHandler() {
            this.inputType = 'Ubah';
            this.editId = this.userId;
            this.form.name = this.userName;
            this.form.email = this.userEmail;
            this.dialog = true;
        },
        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        close() {
            this.dialog = false;
            this.inputType = 'Tambah';
            this.dialogConfirm = false;
            this.readData();
        },
        cancel() {
            this.resetForm();
            this.readData();
            this.dialog = false;
            this.dialogConfirm = false;
            this.inputType = 'Tambah';
        },
        resetForm() {
            this.form = { name: null,
                email: null,
                password: null};
        },
    },
    computed: {
        formTitle() {
            return this.inputType;
        },
    },
    mounted() {
        this.readData();
    },
};
</script>