<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Books </h3>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true"> Tambah </v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="users" :search="search">
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="showHandler(item)"> show </v-btn>
                    <v-btn small class="mr-2" @click="editHandler(item)"> edit </v-btn>
                    <v-btn small @click="deleteHandler(item.id)"> delete </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }} User</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field v-model="form.title" label="Title" required></v-text-field>
                        <v-text-field v-model="form.date" type="date" label="Date" required></v-text-field>
                        <v-text-field v-model="form.genre" label="Genre" required></v-text-field>
                        <v-text-field v-model="form.description" label="Description" required></v-text-field>
                        <v-textarea v-model="form.text" text label="Text" required></v-textarea>
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
                    Anda Yakin ingin menghapus artikel ini?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogConfirm = false"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogShow" persistent max-width="800px">
            <v-card>
                <v-card-title>
                    <span class="headline">Show</span>
                </v-card-title>
                <v-card-text>
                    <v-textarea v-model="form.text" readonly></v-textarea>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogShow = false"> Close </v-btn>
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
            dialogShow: false,
            headers: [
                {
                    text: "Title",
                    align: "start",
                    sortable: true,
                    value: "title",
                },
                { text: "Date", value: "date" },
                { text: "Genre", value: "genre" },
                { text: "Description", value: "description" },
                { text: "Actions", value: "actions" },
            ],
            user: new FormData,
            users: [],
            form: {
                title: null,
                date: null,
                genre: null,
                description: null,
                text: null,
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
            var url = this.$api + '/book';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.users = response.data.data;
            })
        },
        save() {
            this.user.append('title', this.form.title);
            this.user.append('date', this.form.date);
            this.user.append('genre', this.form.genre);
            this.user.append('description', this.form.description);
            this.user.append('text', this.form.text);

            var url = this.$api + '/book/'
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
                title : this.form.title,
                date : this.form.date,
                genre : this.form.genre,
                description : this.form.description,
                text : this.form.text
            };

            var url = this.$api + '/book/' + this.editId;
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
            var url = this.$api + '/book/' + this.deleteId;
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
        editHandler(item) {
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.title = item.title;
            this.form.date = item.date;
            this.form.genre = item.genre;
            this.form.description = item.description;
            this.form.text = item.text;
            this.dialog = true;
        },
        deleteHandler(id) {
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        showHandler(item) {
            this.form.text = item.text;
            this.dialogShow = true;
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
            this.form = { title: null,
                date: null,
                genre: null,
                description: null,
                text: null };
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