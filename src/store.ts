import { defineStore } from 'pinia'

export const useStore = defineStore(
  'store',
  () => {
    const score = ref(0)
    const record = ref(0)
    const restart = ref(true) // 是否重新开始

    const updateScore = (_score: number) => score.value = _score
    const updateRecord = (_record: number) => record.value = Math.max(record.value, _record)
    const updateRestart = (_restart: boolean) => restart.value = _restart

    return {
      score,
      record,
      restart,
      updateScore,
      updateRecord,
      updateRestart,
    }
  },
)
