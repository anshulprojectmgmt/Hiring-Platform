export const createHelperFun = (inputType) => {
    switch(inputType) {
      case "mixlist_integer" :
        return 'helper(input1,input2)'
      case "integer" :
        return 'helper(input1)'
      case "string" :
        return 'helper(input1)'
      case "float" :
        return 'helper(input1)'
      case "string_string" :
        return 'helper(input1,input2)'
      case "mixlist" :
        return 'helper(input1)'
      case "mixlist_string" :
        return 'helper(input1,input2)'
      case "mixlist_float" :
        return 'helper(input1,input2)'
      case "mixlist_mixlist" :
        return 'helper(input1,input2)'
      }
  }

  export const userHelperFun = (inputType) => {
    switch(inputType) {
      case "mixlist_integer" :
        return 'helper(arr, num)'
      case "integer" :
        return 'helper(num)'
      case "string" :
        return 'helper(str)'
      case "float" :
        return 'helper(num)'
      case "string_string" :
        return 'helper(str1, str2)'
      case "mixlist" :
        return 'helper(arr)'
      case "mixlist_string" :
        return 'helper(arr, str)'
      case "mixlist_float" :
        return 'helper(arr, num)'
      case "mixlist_mixlist" :
        return 'helper(arr1, arr2)'
      }
  }








