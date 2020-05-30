<template>
    <v-container>
        <v-alert type="info" dismissible prominent v-if="msg">{{msg}}</v-alert>
        <v-alert type="error" dismissible dense v-if="wrongPassword">Onjuist wachtwoord</v-alert>
        <v-form ref="form"
                @submit.prevent="unlockAccess()"
                v-on:keydown.enter="$event.stopPropagation()"
                v-model="valid"
                lazy-validation>
            <v-text-field
                    label="Wachtwoord"
                    v-model="password"
                    :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordShow ? 'text' : 'password'"
                    @click:append="passwordShow = !passwordShow"
                    :rules="[rules.required]"
                    required
            >
            </v-text-field>
            <v-btn
                    :disabled="!valid"
                    @click="unlockAccess()"
            >
                Ontgrendelen
            </v-btn>
        </v-form>
    </v-container>
</template>

<script>
    import LogAPI from "../api/Log";

    export default {
        name: "Login",
        props: {
            msg: String
        },
        data: () => ({
            passwordShow: false,
            password: undefined,
            rules: {
                required: value => !!value || 'Verplicht.',
            },
            valid: true,
            wrongPassword: false,
            ip: undefined,
        }),
        methods: {
            unlockAccess() {
                if(this.$refs.form.validate()) {
                    if (this.password === "ballenhok") {
                        this.wrongPassword = false;
                        localStorage.setItem("lastLogin", new Date().toISOString());
                        LogAPI.login();
                        this.$router.push(this.$route.query.nextUrl || '/')
                    } else {
                        this.wrongPassword = true;
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
