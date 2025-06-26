import { React, forwardRef, useImperativeHandle } from "react";
import $ from 'jquery';


const FrmValidations = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({

    async validateForm(formId) {
      // debugger
      const form = $('#' + formId);
      const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const validateNumber = /^[0-9\b]+$/;

      let inputObj;
      for (let i = 0; i <= form.get(0).length - 1; i++) {
        inputObj = form.get(0)[i];
        if (inputObj.type === 'text' && (!$('#' + inputObj.id).attr('optional') && !$('#' + inputObj.id).hasClass('optional')) && inputObj.value === '') {
          if (!['custom-select__input','select__input'].includes(inputObj.className)) {
            $("#error_" + inputObj.id).show();
            $("#" + inputObj.id).focus();
            $("#error_" + inputObj.id).text("Please fill this field...!");
            return false;
          }
        } else if (inputObj.type === 'email' && !$('#' + inputObj.id).attr('optional') && !validateEmail.test(inputObj.value) && inputObj.value === '') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please enter valid email...!");
          return false;
        } else if (inputObj.type === 'number' && !$('#' + inputObj.id).attr('optional') && !validateNumber.test(inputObj.value) && inputObj.value === '') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please enter only numeric input...!");
          return false;
        } else if (inputObj.type === 'date' && !$('#' + inputObj.id).attr('optional') && inputObj.value === '' || inputObj.value === 'undefined') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please fill this field...!");
          return false;
        } else if (inputObj.type === 'select-one' && !$('#' + inputObj.id).attr('optional') && (inputObj.value === '' || inputObj.value === '0')) {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text('Please select at least one option...!');
          return false;
        } else if (inputObj.type === 'file' && !$('#' + inputObj.id).attr('optional') && inputObj.value === '') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text('Please upload file...!');
          return false;
        } else if (inputObj.type === 'textarea' && !$('#' + inputObj.id).attr('optional') && inputObj.value === '' || inputObj.value === 'undefined') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please fill this field...!");
          return false;
        } else if (inputObj.type === 'file' && !$('#' + inputObj.id).attr('optional') && inputObj.value === '' || inputObj.value === 'undefined') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please attach the file...!");
          return false;
        } else if (inputObj.type === 'datetime-local' && !$('#' + inputObj.id).attr('optional') && inputObj.value === '' || inputObj.value === 'undefined') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please fill this field...!");
          return false;
        } else if (inputObj.type === 'password' && !$('#' + inputObj.id).attr('optional') && inputObj.value === '' || inputObj.value === 'undefined') {
          $("#error_" + inputObj.id).show();
          $("#" + inputObj.id).focus();
          $("#error_" + inputObj.id).text("Please enter password...!");
          return false;
        }
      }
      return true;
    },

    async readOnly(formId) {
      let formObj = $(`#${formId}`);
      let inputObj;
      for (let i = 0; i <= formObj.get(0).length - 1; i++) {
        inputObj = formObj.get(0)[i];
        if (inputObj.type === 'text') {
          $('#' + inputObj.id).attr('readonly', true);
        } else if (inputObj.type === 'select-one') {
          $('#' + inputObj.id).attr('disabled', true);
        } else if (inputObj.type === 'file') {
          $('#' + inputObj.id).attr('disabled', true);
        } else if (inputObj.type === 'textarea') {
          $('#' + inputObj.id).attr('readonly', true);
        } else if (inputObj.type === 'date') {
          $('#' + inputObj.id).attr('readonly', true);
        } else if (inputObj.type === 'email') {
          $('#' + inputObj.id).attr('readonly', true);
        } else if (inputObj.type === 'number') {
          $('#' + inputObj.id).attr('readonly', true);
        } else if (inputObj.type === 'datetime-local') {
          $('#' + inputObj.id).attr('readonly', true);
        }

      }
    },

    async removeReadOnlyAttr(formId) {
      let formObj = $(`#${formId}`);
      let inputObj;
      for (let i = 0; i <= formObj.get(0).length - 1; i++) {
        inputObj = formObj.get(0)[i];
        if (inputObj.type === 'text') {
          $('#' + inputObj.id).attr('readonly', false);
        } else if (inputObj.type === 'select-one') {
          $('#' + inputObj.id).attr('disabled', false);
        } else if (inputObj.type === 'file') {
          $('#' + inputObj.id).attr('disabled', false);
        } else if (inputObj.type === 'textarea') {
          $('#' + inputObj.id).attr('readonly', false);
        } else if (inputObj.type === 'date') {
          $('#' + inputObj.id).attr('readonly', false);
        } else if (inputObj.type === 'email') {
          $('#' + inputObj.id).attr('readonly', false);
        } else if (inputObj.type === 'number') {
          $('#' + inputObj.id).attr('readonly', false);
        }

      }
    },

    validateFieldsOnChange(formId) {
      let formObj = $(`#${formId}`);
      const validateEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let inputObj;

      for (var i = 0; i <= formObj.get(0).length - 1; i++) {
        inputObj = formObj.get(0)[i];
        if (inputObj.type === 'text' && inputObj.value !== '') {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'select-one' && inputObj.value !== '') {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'textarea' && inputObj.value !== '') {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'date' && inputObj.value !== '') {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'email' && inputObj.value !== '' && validateEmail.test(inputObj.value)) {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'datetime-local' && inputObj.value !== '') {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'number' && inputObj.value !== '') {
          $("#error_" + inputObj.id).hide();
        } else if (inputObj.type === 'file') {
          $("#error_" + inputObj.id).hide();
        }
      }
    }
  }))

  return (<></>)
})

export default FrmValidations;
