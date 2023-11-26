<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate"; // Đây là các câu lệnh import trong JavaScript, 
//nó đang nhập một thư viện validation có tên là “yup” và ba component Vue.js từ thư viện “vee-validate”.


export default {
  name: "SignupFormForCustomer",
  components: {
    Form,
    Field,
    ErrorMessage,
  },//Đây là định nghĩa các component con được sử dụng trong component này. Trong trường hợp này, có ba component con là “Form”, “Field” và “ErrorMessage”.
  data() {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required("Vui lòng nhập tên")
        .min(3, "Phải có ít nhất 3 ký tự!")
        .max(20, "Phải có tối đa 20 ký tự!"),
      phone: yup
        .string()
        .required("Vui lòng nhập SĐT")
        .matches(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
      password: yup
        .string()
        .required("Vui lòng nhập Mật khẩu")
        .min(6, "Phải có ít nhất 6 ký tự!")
        .max(40, "Phải có tối đa 40 ký tự!"),
      confirmpassword: yup
        .string()
        .required("Vui lòng nhập lại Mật khẩu")
        .min(6, "Phải có ít nhất 6 ký tự!")
        .max(40, "Phải có tối đa 40 ký tự!")
        .oneOf([yup.ref('password')], 'Vui lòng nhập lại mật khẩu'),
      address: yup
        .string()
        .max(500, "Tối đa 500 ký tự!"),
    });

    return {
      successful: false,
      loading: false,
      message: "",
      schema,
    };
  },//Đây là định nghĩa dữ liệu ban đầu của component. Có bốn thuộc tính được khởi tạo: successful, loading, message và schema. 
//schema là một đối tượng yup được sử dụng để xác thực dữ liệu form
  computed: {
    loggedIn() {
      return this.$store.state.userC.status.loggedIn;
    },
  },
  mounted() {// Đây là một vòng đời của component Vue.js, được gọi ngay sau khi một instance của component được gắn vào DOM. 
//Trong trường hợp này, nó kiểm tra xem người dùng đã đăng nhập chưa, nếu đã đăng nhập thì chuyển hướng đến trang đăng nhập.
    if (this.loggedIn) {
      this.$emit('notification', {
        message: "Already signed in",
        type: "success"
      })
      this.$emit('updateAuthentication');
      this.$router.push(this.$route.query.redirect || { name: "CustomerSignin" })
    }
  },
  methods: {// Đây là các phương thức được định nghĩa trong component. Các phương thức này có thể được gọi từ template của
//component hoặc từ các phương thức khác trong component.
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;

      this.$store.dispatch("userC/register", user).then(
        (data) => {
          this.message = data.message;
          this.successful = true;
          this.loading = false;
          this.$emit('notification', {
            message: "Đăng ký thành công!",
            type: "success"
          })
          this.$router.push({ name: "CustomerSignin" });
        },
        (error) => {
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          this.$emit('notification', { message: error.response?.data.message || error.message, type: "error" });
          this.successful = false;
          this.loading = false;
        }
      );
    },
  },
};
</script>

<template>
  <div id="form-wrapper">
    <div class="title"></div>
    <Form @submit="handleRegister" :validation-schema="schema">
      <div v-if="!successful" class="form-group">
        <label for="name">Họ và Tên</label>
        <Field name="name" type="text" class="form-control" />
        <ErrorMessage name="name" class="error-feedback" />
      </div>
      <div v-if="!successful" class="form-group">
        <label for="phone">Số điện thoại</label>
        <Field name="phone" type="text" class="form-control" />
        <ErrorMessage name="phone" class="error-feedback" />
      </div>
      <div v-if="!successful" class="form-group">
        <label for="password">Mật khẩu</label>
        <Field name="password" type="password" class="form-control" />
        <ErrorMessage name="password" class="error-feedback" />
      </div>
      <div v-if="!successful" class="form-group">
        <label for="confirmpassword">Nhập lại mật khẩu</label>
        <Field name="confirmpassword" type="password" class="form-control" />
        <ErrorMessage name="confirmpassword" class="error-feedback" />
      </div>
      <div v-if="!successful" class="form-group">
        <label for="address">Địa chỉ</label>
        <Field name="address" type="text" class="form-control" />
        <ErrorMessage name="address" class="error-feedback" />
      </div>

      <div v-if="!successful" class="form-group">
        <button class="button-52" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          Đăng ký
        </button>
      </div>
    </Form>
  </div>
</template>

<style scoped>
#form-wrapper {
  background-color: #00000000;
  width: 100%;
  height: 100%;
  display: flex;
  padding-block: 2%;
  gap: 16px;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 720px) {
    & {
      flex-direction: column;
    }
  }
}

Form {
  padding: 2rem;
  box-sizing: border-box;
  background-color: beige;
  border-radius: 16px;
}

.title {
  width: 100px;
  margin-block: 30px;
  font-size: 32px;
  font-weight: bolder;
}

.form-group {
  width: 300px;
  margin: 6px 0;
  padding: 8px;
  background-color: var(--color-background-1);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;

  &>label {
    font-weight: bold;
  }

  &>span[role=alert] {
    color: red;
  }

  &.form-message:empty {
    margin: 0;
    padding: 0;
  }
}

.form-group>input {
  width: 100%;
  background-color: transparent;
  transition: (transform, padding) .5s ease-in-out;
  font-size: 16px;
  line-height: 8px;
  color: #575756;
  background-color: transparent;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-transition: (transform, padding) .5s ease-in-out;
  -moz-transition: (transform, padding) .5s ease-in-out;
  -ms-transition: (transform, padding) .5s ease-in-out;
  -o-transition: (transform, padding) .5s ease-in-out;
  padding: 12px 0;
  outline: 0;
  border: 1px solid transparent;
  border-bottom: 1px solid #575756;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
}

.form-group>input::placeholder {
  content: "...";
  color: rgba(87, 87, 86, 0.8);
}

.button-52 {
  font-size: 16px;
  font-weight: 200;
  padding: 13px 20px 13px;
  outline: 0;
  border: 1px solid black;
  cursor: pointer;
  position: relative;
  background-color: rgba(0, 0, 0, 0);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;

  z-index: 1;

  box-shadow: inset 0 0 4px #888;

  color: white;
  text-shadow: 0 0 5px #7b7b7b;
  font-weight: 700;
}

.button-52:after {
  content: "";
  background-color: var(--primary-color);
  width: 100%;
  z-index: -1;
  position: absolute;
  height: 100%;
  top: 7px;
  left: 7px;
  transition: 0.2s;
}

.button-52:hover:after {
  top: 0px;
  left: 0px;
}

@media (min-width: 768px) {
  .button-52 {
    padding: 13px 50px 13px;
  }
}
</style>