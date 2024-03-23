module.exports = {
    baseUrl: "https://api.ruru2050.com",
    active: 'prod',
    // active: 'debug',
    appId: 'wx302e4bda83ace9b8',
    mpName: '如如原料',
    orgName: '上海如如进出口有限公司',
    idNumberPattern : /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    decimal_two_digit: '^\\d*?(\\.(\\d{0,2})?){0,1}?$', //最多两位小数
    mobilePattern: /^1[3-9][0-9]\d{8}$/
};
