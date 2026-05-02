function getNumberColor(number) {
  const colors = {
    0: 'red,violet',
    1: 'green',
    2: 'red',
    3: 'green',
    4: 'red',
    5: 'green,violet',
    6: 'red',
    7: 'green',
    8: 'red',
    9: 'green',
  };
  return colors[number];
}

function checkWin(selectType, selectValue, resultNumber) {
  const number = parseInt(resultNumber);
  const val = String(selectValue).toLowerCase();

  switch (selectType.toLowerCase()) {
    case 'number':
      return number === parseInt(val);

    case 'color':
      if (val === 'green') return [1, 3, 7, 9].includes(number) || number === 5;
      if (val === 'red') return [2, 4, 6, 8].includes(number) || number === 0;
      if (val === 'violet') return number === 0 || number === 5;
      return false;

    case 'size':
      if (val === 'big') return number >= 5;
      if (val === 'small') return number <= 4;
      return false;

    default:
      return false;
  }
}

function getMultiplier(selectType, selectValue, resultNumber) {
  const number = parseInt(resultNumber);
  const val = String(selectValue).toLowerCase();

  switch (selectType.toLowerCase()) {
    case 'number':
      return 9;

    case 'size':
      return 2;

    case 'color':
      if (val === 'green') {
        if (number === 5) return 1.5;
        return 2;
      }
      if (val === 'red') {
        if (number === 0) return 1.5;
        return 2;
      }
      if (val === 'violet') {
        return 4.5;
      }
      return 0;

    default:
      return 0;
  }
}

module.exports = { getNumberColor, checkWin, getMultiplier };