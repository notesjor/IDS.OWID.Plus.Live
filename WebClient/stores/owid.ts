import { defineStore } from 'pinia'
import { OwidLiveStorage } from './OwidLiveStorage'
import { Normalize, Prefill } from './DataHelper'

export const useOwidStore = defineStore('owid', {
  state: () => ({
    years: [] as number[],
    yearMin: 0,
    yearMax: 0,
    yearInc: 0,
    yearFocus: 2024,
    owid: null as OwidLiveStorage | null,
    version: 0,
    searches: 0,
    vizNoCommit: 0,
    vizOptionRelative: true,
    vizOptionGranulation: 0,
    vizOptionSmoothing: 16,
    vizData: null as Record<string, any> | null
  }),
  actions: {
    setYears(years: number[]) {
      this.years = years
      this.yearMin = Math.min(...years)
      this.yearMax = Math.max(...years)
      this.yearInc = -1
    },
    focusYear(year: number) {
      this.yearFocus = year
    },
    init(payload: any) {
      this.owid = new OwidLiveStorage(payload)
    },
    clearAll() {
      this.owid?.clearAll()
    },
    updateN(N: number) {
      if (this.owid) this.owid.N = N
    },
    search({ n, queryItems, items }: { n: number, queryItems: any, items: any[] }) {
      if (!this.owid) return
      this.owid.addOwidLiveSearchItem(n, queryItems, items)
      this.searches = Object.keys(this.owid.OwidLiveSearches).length
    },
    vizOption(payload: { r: boolean, g: number, s: number }) {
      this.vizOptionRelative = payload.r
      this.vizOptionGranulation = payload.g
      this.vizOptionSmoothing = payload.s
    },
    selectSearchChange(payload: any[]) {
      this.owid?.selectSearchItems(payload)
    },
    selectSearchHistoryItemsChange(payload: any[]) {
      this.owid?.selectSearchHistoryItem(payload)
    },
    modelLoad(o: any) {
      this.owid = OwidLiveStorage.load(o.Norm, o.OwidLiveSearches, o.N, o.Dates, o.Total, o.NormTotal)
    },
    calculate() {
      if (this.owid === null || this.owid.OwidLiveSearches === null) {
        this.vizData = null
        return
      }

      this.vizData = {}
      const res: Record<string, any> = {}

      switch (this.vizOptionGranulation) {
        case 1:
          this.owid.Dates = this.owid.DatesWeek
          break
        case 2:
          this.owid.Dates = this.owid.DatesMonth
          break
        case 3:
          this.owid.Dates = this.owid.DatesQuarter
          break
        case 4:
          this.owid.Dates = this.owid.DatesYear
          break
        default:
          this.owid.Dates = this.owid.DatesDate
      }

      for (const s in this.owid.OwidLiveSearches) {
        const search = this.owid.OwidLiveSearches[s]
        if (search.N !== this.owid.N) continue

        const subItems: Record<string, any> = {}
        for (const i in search.OwidLiveStorageTimeItems) {
          const item = search.OwidLiveStorageTimeItems[i]
          if (!item.IsSelected) continue

          let sitem
          switch (this.vizOptionGranulation) {
            case 1:
              sitem = item.Week
              break
            case 2:
              sitem = item.Month
              break
            case 3:
              sitem = item.Quarter
              break
            case 4:
              sitem = item.Year
              break
            default:
              sitem = item.Date
          }

          subItems[item.Label] = {
            name: item.Name,
            label: item.Label,
            data: sitem,
            items: null
          }
        }

        if (Object.keys(subItems).length === 0) continue

        if (search.IsSelected) {
          let sgrp
          switch (this.vizOptionGranulation) {
            case 1:
              sgrp = search.Week
              break
            case 2:
              sgrp = search.Month
              break
            case 3:
              sgrp = search.Quarter
              break
            case 4:
              sgrp = search.Year
              break
            default:
              sgrp = search.Date
          }

          res[search.Name] = {
            name: search.Name,
            label: search.Label,
            data: sgrp,
            items: subItems
          }
        } else {
          Object.keys(subItems).forEach((x) => {
            res[x] = {
              name: subItems[x].name,
              label: subItems[x].label,
              data: subItems[x].data,
              items: [subItems[x]]
            }
          })
        }
      }

      let normData
      switch (this.vizOptionGranulation) {
        case 1:
          normData = this.owid.NormWeek
          break
        case 2:
          normData = this.owid.NormMonth
          break
        case 3:
          normData = this.owid.NormQuarter
          break
        case 4:
          normData = this.owid.NormYear
          break
        default:
          normData = this.owid.NormDate
      }

      if (this.vizOptionRelative) {
        Object.keys(res).forEach((key) => {
          res[key] = Normalize(res[key], normData)
          if (res[key].items != null) {
            Object.keys(res[key].items).forEach((subKey) => {
              res[key].items[subKey] = Normalize(res[key].items[subKey], normData)
            })
          }
        })
      } else {
        Object.keys(res).forEach((key) => {
          res[key] = Prefill(res[key], normData)
          if (res[key].items != null) {
            Object.keys(res[key].items).forEach((subKey) => {
              res[key].items[subKey] = Prefill(res[key].items[subKey], normData)
            })
          }
        })
      }

      if (this.vizOptionSmoothing > 1) {
        let carret: number
        let odd: boolean

        if (this.vizOptionSmoothing % 2 === 0) {
          carret = parseInt((this.vizOptionSmoothing / 2).toFixed(0))
          odd = false
        } else {
          carret = parseInt(((this.vizOptionSmoothing - 1) / 2).toFixed(0))
          odd = true
        }

        const halfVOS = this.vizOptionSmoothing * 2.0

        Object.keys(res).forEach((key) => {
          const item = res[key].data
          const keys = this.owid.Dates
          const nval: Record<string, any> = {}
          const keysLength = keys.length

          for (let i = carret; i < keysLength - carret; i++) {
            const dates = new Set<string>()
            let sum = 0.0

            for (let j = -carret; j <= carret; j++) {
              const currentKey = keys[i + j]
              if (!item[currentKey]) continue

              item[currentKey].dates.forEach((d: string) => dates.add(d))

              if (odd || (j !== -carret && j !== carret)) {
                sum += item[currentKey].value * (1.0 / this.vizOptionSmoothing)
              } else {
                sum += item[currentKey].value * (1.0 / halfVOS)
              }
            }

            nval[keys[i]] = {
              dates,
              value: parseFloat(sum.toFixed(5))
            }
          }

          res[key].data = nval
        })
      }

      this.vizData = res
      this.version++
    }
  }
})
