import { defineRule } from "vee-validate";

export default defineNuxtPlugin((vueApp) => {
  defineRule("required", (value, [], ctx) => {
    return !!value || value?.length || "Field Required";
  }),
    defineRule("requiredN", (value, [], ctx) => {
      return !!value || value?.length || `${ctx.name} Required`;
    }),
    defineRule("boolReq", (value, [], ctx) => {
      return typeof value == "boolean" || "Field Required";
    });
    defineRule("date_greater_than_latest", (value, [latestDate], ctx) => {
      console.log("value", value, "latestDate", latestDate);
    
      // Check if latestDate is null, undefined, or an empty string
      if (!latestDate || latestDate === "") {
        console.log("latestDate is null or empty, validation passed.");
        return true; // Validation passed because there's no latestDate to compare against
      }
    
      // Convert both value and latestDate to Date objects
      const selectedDate = new Date(value);
      const comparisonDate = new Date(latestDate);
    
      // Check if comparisonDate is an Invalid Date
      if (isNaN(comparisonDate.getTime())) {
        console.log("latestDate is invalid, validation passed.");
        return true; // Validation passed because latestDate is invalid
      }
    
      console.log("selectedDate", selectedDate, "comparisonDate", comparisonDate);
    
      // Check if selectedDate is greater than or equal to comparisonDate
      if (selectedDate > comparisonDate) {
        console.log("Validation passed, selectedDate is greater.");
        return true; // Validation passed
      } else {
        console.log("Validation failed, selectedDate is not greater.");
        return `Selected date must be greater than this ${{latestDate}} date.`; // Validation failed
      }
    });
    defineRule("date_greater_than_latest_plus_seven", (value, [startDate], ctx) => {
      console.log("hello", value, "abu", startDate, "context", ctx.form.start_date);
      if (!ctx.form.start_date) {
        return true;
      }
      // Convert start_date to Date object
      const comparisonDate = new Date(ctx.form.start_date);
    
      // Convert value to Date object
      const selectedDate = new Date(value);
    
      // Calculate the difference in days
      const diffTime = Math.abs(selectedDate - comparisonDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
      // Function to generate recommended dates
      const generateRecommendedDates = (baseDate) => {
        const recommendedDates = [];
        for (let i = 1; i <= 3; i++) { // Generate 3 recommended dates
          const nextDate = new Date(baseDate.getTime() + (7 * i * 24 * 60 * 60 * 1000));
          recommendedDates.push(nextDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }
        return recommendedDates;
      };
    
      // Check if diffDays is a multiple of 7
      if (diffDays % 7 === 0 && diffDays !== 0) {
        return true; // Validation passed
      } else {
        const recommendedDates = generateRecommendedDates(comparisonDate);
        return `The date gap from the start date must be a multiple of 7. Recommended dates: ${recommendedDates.join(', ')}`; // Validation failed with recommendations
      }
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

  defineRule("min_length", (value, [min], ctx) => {
    console.log("min", min, value, value?.length >= min);
    return value?.length >= min
      ? true
      : `${ctx.field} Must be ${min} items or more`;
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
    defineRule("phoneNumber", (value) => {
      return (
        !value ||
        /^(\+2519|\+2517)\d{8}$/.test(value) ||
        "Not valid phone number"
      );
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
  defineRule("web_link", (value, [], ctx) => {
    return (
      !value ||
      /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/.test(
        value
      ) ||
      "Not Valid Web Url"
    );
  });
});
