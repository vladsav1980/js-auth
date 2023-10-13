import {
  Form,
  REG_EXP_EMAIL,
  REG_EXP_PASSWORD,
} from '../../script/form'

class RecoveryConfirmForm extends Form {
  FIELD_NAME = {
    CODE: 'code',
    PASSWORD: 'password',
    PASSWORD_AGAIN: 'passwordAgain',
  }
  FIELD_ERROR = {
    IS_EMPTY: 'This field cannot be left empty',
    IS_BIG: 'Too long',
    PASSWORD:
      'Your password must contain at least 8 characters, including at least 1 digit, 1 lowercase letter, and 1 uppercase letter',
    PASSWORD_AGAIN: 'The passwords must match',
  }

  validate = (name, value) => {
    if (String(value).length < 1) {
      return this.FIELD_ERROR.IS_EMPTY
    }

    if (String(value).length > 30) {
      return this.FIELD_ERROR.IS_BIG
    }

    if (name === this.FIELD_NAME.PASSWORD) {
      if (!REG_EXP_PASSWORD.test(String(value))) {
        return this.FIELD_ERROR.PASSWORD
      }
    }

    if (name === this.FIELD_NAME.PASSWORD_AGAIN) {
      if (
        String(value) !==
        this.value[this.FIELD_NAME.PASSWORD]
      ) {
        return this.FIELD_ERROR.PASSWORD_AGAIN
      }
    }
  }

  submit = async () => {
    if (this.disabled) {
      this.validateAll()
    } else {
      console.log(this.value)

      this.setAlert('progress', 'Uploading in progress...')

      try {
        const res = await fetch('/recovery-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: this.convertData(),
        })
        const data = await res.json()
        if (res.ok) {
          this.setAlert('success', data.message)
        } else {
          this.setAlert('error', data.message)
        }
      } catch (error) {
        this.setAlert('error', error.message)
      }
    }
  }

  convertData = () => {
    return JSON.stringify({
      [this.FIELD_NAME.CODE]: Number(
        this.value[this.FIELD_NAME.CODE],
      ),
      [this.FIELD_NAME.PASSWORD]:
        this.value[this.FIELD_NAME.PASSWORD],
    })
  }
}

window.recoveryConfirmForm = new RecoveryConfirmForm()
