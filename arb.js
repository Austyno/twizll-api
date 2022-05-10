var search = function (nums, target) {
  let index
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      index = i
    }
  }
  return index
}

console.log(search([-1, 0, 3, 5, 9, 12], 9))
