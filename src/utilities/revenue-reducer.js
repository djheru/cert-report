module.exports = (
  sum,
  { down_payment = 0, installment_payment = 0, monthly_fee = 0 },
) => sum + down_payment / 12 + installment_payment + monthly_fee;
