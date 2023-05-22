export default function getDifferenceSubmissionTime(lastSend: Date, startedAt: Date) {
  const time = Math.abs(new Date(lastSend).getTime()-new Date(startedAt).getTime())/60000;
  const suffix = time<1 ?'segundos' :'minuto(s)';
  const newTime = time<1 ?time*60 :time;
  const timeString = newTime.toFixed(time<1 ?0 :2);

  return `${timeString} ${suffix}`;
}