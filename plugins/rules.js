import { defineRule } from "vee-validate";

export default defineNuxtPlugin((vueApp) => {
  defineRule("required", (value, [], ctx) => {
    return !!value || value?.length || "Field Required";
  }),
    defineRule("requiredN", (value, [], ctx) => {
      console.log();
      return !!value || value?.length || `${ctx.name} Required`;
    }),
    defineRule("boolReq", (value, [], ctx) => {
      return typeof value == "boolean" || "Field Required";
    });

  defineRule("array_object_required", (value, [], ctx) => {
    return value?.length || "Field Required";
  }),
    defineRule("number", (value) => {
      return !value || /^[0-9]+$/.test(value) || "Number only";
    }),
    defineRule("numberFromZero", (value, [], ctx) => {
      return /^(?:0|[1-9]\d*)$/.test(value) || "Number only";
    });
  defineRule("numrange", (value) => {
    return !value || /^[0-9-]+$/.test(value) || "Number only";
  }),
    defineRule("email", (value) => {
      return (
        !value ||
        /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
          value
        ) ||
        "Not Valid Email"
      );
    }),
    defineRule("International_phone_number", (value) => {
      return (
        !value ||
        /^\+(?:[0-9] ?){6,14}[0-9]$/.test(value) ||
        "Not valid phone number"
      );
    }),
    defineRule("minLength", (value, [], context) => {
      if (value.length >= context.rule.params[0]) {
        return true;
      } else {
        return `${context.field} is must be greater than ${context.rule.params[0]}`;
      }
    });

  defineRule("minLength", (value, [], context) => {
    if (value.length >= context.rule.params[0]) {
      return true;
    } else {
      return `${context.name} is must be greater than ${context.rule.params[0]}`;
    }
  });

  defineRule("maxLength", (value, [], context) => {
    if (value.length >= context.rule.params[0]) {
      return true;
    } else {
      return `${context.name} is must be less than ${context.rule.params[0]}`;
    }
  });

  defineRule("email_phone", (value) => {
    return (
      !value ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
      /^(\+2519|\+2517)\d{8}$/.test(value) ||
      "invalid email or phone number"
    );
  });

  defineRule("ethio_phone", (value) => {
    return !value || /^(7|9)\d{8}$/.test(value) || "Not valid phone number";
  }),
    defineRule("password", (value) => {
      return (
        !value ||
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(value) ||
        "Password must contain at least 6 characters, including UPPER/lowercase and numbers and special characters"
      );
    }),
    defineRule("confirmed", (value, [other], ctx) => {
      return !value || value === other || "Password is not the same";
    });
});
