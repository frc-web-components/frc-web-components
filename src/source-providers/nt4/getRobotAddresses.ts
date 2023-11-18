export function getRobotAddresses(teamNumber: number) {
  const t = teamNumber.toString().at(-4) ?? '';
  const e = teamNumber.toString().at(-3) ?? '';
  const a = teamNumber.toString().at(-2) ?? '';
  const m = teamNumber.toString().at(-1) ?? '';

  let te = parseInt(`${t}${e}`, 10);
  let am = parseInt(`${a}${m}`, 10);

  if (Number.isNaN(te)) {
    te = 0;
  }
  if (Number.isNaN(am)) {
    am = 0;
  }

  const team = t + e + a + m;

  return [
    `10.${te.toString()}.${am.toString()}.2`,
    `172.22.11.2`,
    `roborio-${team}-FRC.local`,
    `roborio-${team}-FRC.lan`,
    `roborio-${team}-FRC.frc-field.local`,
  ];
}
