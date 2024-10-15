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
        return 'def helper(arr, num)'
      case "integer" :
        return 'def helper(num)'
      case "string" :
        return 'def helper(str)'
      case "float" :
        return 'def helper(num)'
      case "string_string" :
        return 'def helper(str1, str2)'
      case "mixlist" :
        return 'def helper(arr)'
      case "mixlist_string" :
        return 'def helper(arr, str)'
      case "mixlist_float" :
        return 'def helper(arr, num)'
      case "mixlist_mixlist" :
        return 'def helper(arr1, arr2)'
      }
  }