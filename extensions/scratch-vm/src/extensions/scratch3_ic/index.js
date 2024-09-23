// Importation des modules nécessaires pour l'extension Scratch
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const ml5 = require('ml5'); // Bibliothèque ml5 pour utiliser les modèles de machine learning
const formatMessage = require('format-message'); // Gestion des messages multilingues
// Icone pour l'extension
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM6c2VyaWY9Imh0dHA6Ly93d3cuc2VyaWYuY29tLyIgc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxLjU7Ij4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDUuNTE4MjIsMCwwLDEwLjkyODUsLTY4MS45OTgsLTE5OS42MTQpIj4KICAgICAgICA8cmVjdCB4PSIxMjMuNTk0IiB5PSIxOC4xNjkiIHdpZHRoPSI2Ni4zMTIiIGhlaWdodD0iMzMuMTM3IiBzdHlsZT0iZmlsbDpyZ2IoMTMsMTg5LDE0MCk7c3Ryb2tlOnJnYigxMywxODksMTQwKTtzdHJva2Utd2lkdGg6MC4xMnB4OyIvPgogICAgPC9nPgogICAgPHBhdGggaWQ9InRvaWxlIiBkPSJNOTcsOTZMODUuODkxLDExNS43MUw2My43MTMsMTIwLjE4NEw3OS4wMjUsMTM2Ljg0TDc2LjQyOCwxNTkuMzE2TDk3LDE0OS45TDExNy41NzIsMTU5LjMxNkwxMTQuOTc1LDEzNi44NEwxMzAuMjg3LDEyMC4xODRMMTA4LjEwOSwxMTUuNzFMOTcsOTZaIiBzdHlsZT0iZmlsbDp3aGl0ZTtzdHJva2U6d2hpdGU7c3Ryb2tlLXdpZHRoOjdweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0OyIvPgogICAgPGcgaWQ9IkNhbHF1ZS1jb3BpZSIgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSw0NCwzKSI+CiAgICAgICAgPHVzZSB4bGluazpocmVmPSIjX0ltYWdlMSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwNXB4IiBoZWlnaHQ9IjkycHgiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJSZWN0YW5nbGUtY29waWUiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsNiw4NykiPgogICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI19JbWFnZTIiIHg9IjAiIHk9IjAiIHdpZHRoPSIxNzlweCIgaGVpZ2h0PSI4OXB4Ii8+CiAgICA8L2c+CiAgICA8ZGVmcz4KICAgICAgICA8aW1hZ2UgaWQ9Il9JbWFnZTEiIHdpZHRoPSIxMDVweCIgaGVpZ2h0PSI5MnB4IiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUdrQUFBQmNDQVlBQUFCdE5ac2tBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBUmxrbEVRVlI0bk8yZGUyd1UxM3JBZnpNZW0zMzR1UnRldG96dGlLY2hoSmZzVUFpRUpEY2hDWEVDVVc1VDBwdGVWZUtmS0NUU1RkS2tLRlhWcGxLYUI2TEtwWFZVb1NhME1xVnBJU0hBZFhKTERIa0RBZXlrTnM4QVpzSDRnZGRlci9lOU03UDk0OWhncjJmQmEzdlhHUFluamZ5WTNaa3o1NXZ2bk85ODV6dmZrVWcrRXBBQlpBRUZRR0hQVVF6TTZQbDlQSkFKakFQU0VseWVDQkFDL0VBSDBBS2NBYzRDRHVBaWNBbTRBZ1FBUGNIbEdZQ1U1UHZkQlR5RkVFZytVQXJZQWJtbkxMMC9lOHVWclBKRit2enNQZlNlbjM2RXdINEJPb0UvQWw4QXZpU1ZMZUdWWUVGb3hYTGdjV0FXY0NkZ1R2QjlFMFVFYUFaT0FkOEN1NER6Z0lzRWFsaWloSlNKMEpySGdWOGhCSk1GS0FtOFp6TFJFUnJXQWh3RTlnQmY5ZndkdWM3M2Jnb3NRQm13RWFnRnd2UnZRbTdGUXdmYWdQOEdmbzFvT2VUaFZtUmZSdXF0VmhEOXpCcmd0MEFKWUJyRTkzVEFaN2ZidmJObXpWS0xpNHNWbTgyV2xwNmVqaVFsVitFaWtRaXFxa1pjTHBmbWNEakNKMCtlbEpxYm15MUFOdUw1Ym5nSmhMRDJBLzhDMUFFZVJrQ3pobHNURWtJWUR3Qi9oZENpY2JFK25KYVdwbWRtWnFxNXVibmRDeGN1RE54Nzc3MTZlWG01T21QR0RLdk5acnVERVg0RGg0UEg0MmwzT0J6dWt5ZFBwaDg3ZGl4OTM3NTk4dG16WjdOY0xsZUdxcXE5Qms0c0xnT2JnZjhDR2hsbWZ6VWNJVW5BSk9CM3dKOERFMk5kejJReWFZc1dMUXBXVkZRRVZxeFlZUzRzTE5Uc2RudUdvaWdadzdoL1V2RjZ2YjRMRnk3d3pUZmZ1SGZ1M0puKzdiZmZadnA4dmd4aTE2RVAwVSs5QTN5SGFQcVRTaG93SGFIYU1kdnJ6TXhNZmNXS0ZhRTllL1owNmJxdVIyNGhmdnp4eHdzVkZSWGQyZG5aSVVtU3J0ZG50U0g2S2tzeUJhUUFxNEdqZ0dwVU1FVlI5RWNlZWFUajg4OC9kL3Y5ZnQ5b1YyaWlDSWZEM29NSER6clhyVnQzUGljblI0c2hwRjdENGgrQjNHUUl5QVNzQlk1emJiQjM5WkFrU2MvTHl3dFVWbFplSE8wS1REYUhEaDI2VUZwYTJxMG9TaXhodVlFUEVJUDNoRmxGSnVBbDRCd0dHaVJKa3Y3b280KzJuRHAxcWxQVE5IVzBLMjAwNk9qbzZOeXdZVU9qMld6MnhSQ1VGMkZNVEV1RW9CVGdONGpSOVlDYm0weW04R3V2dlhiQzdYYTdSN3VpUmh0VlZjTzdkKzgrUG43OCtEWkprZ2EwTmtBUStGZUUzM0xFQkpVT1BJTndoUXhRNVlLQ0F2KzJiZHV1YUpvV0hPMEt1cGs0ZXZSbzA2SkZpeTVpM0c5M0EvK0VjQ1lQR3dtWUM5UWIzQ2d5YmRvMDM3Rmp4NXBIdTBKdVZpNWZ2dHk0Y09IQzg1SWtHZlZUYm1BRFlCMnVnSW9RTnY2QXQySGF0R20rcjcvKzJqWGFGWEd6YytiTW1hYkZpeGRmeHNEUVFreUIvQVZpNm1aSVpBTC9abkRoU0VGQlFTQ2xRWU9udmIzOWw3dnZ2dHNaWXp6VkFDd1lpb0F5RUtaMmUvUkZUU2FUV2xWVjVSenRCeDlySEQ5K3ZHWE9uRGwrQXlFRmdmOEU4dUlWVWluQ1FSaHRaa2RlZWVXVk02cXFoa2I3b2NjaXg0NGRhN1JZTEVZekF4MEk5OXFncmIwY3hGUkQ5TVgwaHg5KytFcFhWMWYzYUQvc1dHYno1czFPczlrY2lxcGJEZUhCdVd1d1Fub1k0Ym50SisyY25KeGdmWDE5NTJnLzVGakg0L0Y0bHk5ZjNtU2dUVUdFTS9hRzJqUWVZU3dNVU1rTkd6WTBxcXFhR2d1TkFJY1BINzZVazVQVEdkMVNJYXk5dTRpYXN1a2JpU01ESzREbkFWdmZEODJmUDk5VlZWV1ZxU2pLV0kxTnVLa29LQ2pJYm0xdFBYL3c0TUU4cmdsRVFuakt4d0g3aURHMWtRdHNJY3FlTjV2Tit2YnQyMVBqb1JIbTlPblRMWk1uVCs1Z1lMUFhDcFQzRlV4ZnRacUVpT3JwMXlZdVhMaFFYYlZxMVppWm5Cc3JsSlNVNUQ3eHhCUE5CcWZzd0ovUXA1WHJLNlJmSXdSMWxZeU1EUDJsbDE3U3JGWnJxcGtiWVJSRkdmZkNDeStZTEJhTE8rcFVHdkFrd2dFTDlHOFBseEkxZXpoMzd0emdVMDg5RlRObUljWHdLQzB0TFZtOWV2VUpHQkNzc2hCaHhBSFhoRlNCQ0Z6c3ExbjYwcVZMUFZLeXczWnVJeVJKa3RhdVhadVRrWkhoanpwbFFVUmQ1WUVRU2hvaTJtZHkzMCtaeldadDVjcVZpWTdEdnUwcEt5dkxMeWdvOEVUOVd3SWVRL1JQeUlpUTM0bEVCY2JuNXVaNlpzeVlrWjZNZ3Q3TzVPVGtwTStiTjYvYjRGUTJQVTJlM1BQTGpPaFB6SnMzejVlZm41OFNVb0pSRk1YOHpEUFBxQWFuTE1BaUVFS2Fnb2pWN2t2ay92dnZsekl5TWdZVGhacGlHRWlTeEpJbFN6S3RWbXQwQUtVSk1ZV1IzaXVrNkhGUW9MeTgzRWk2S1JKQWZuNys1TEt5TWxmVXZ5VkVuNVFsSTJaZisvbUs3SGE3cDdTME5EVTJTaEtTSk1rTEZpem9ORGlWQTJUTGlQNm9uNWs5YTlhc2NFOXNkb29rTVdYS0ZLL0J2KzJBWFVIRWdQWFRwT0xpNHJSRWpJK0N3YURXME5DZzFkVFU2QzB0TFJRV0Z2TEFBdzlJczJmUHpoaksvWFJkanpRMk5vWjI3TmloTlRRMFJMS3lzbGk1Y3FXOGJOa3lPU3NyYTBpRDhQYjI5dkQrL2Z2VjJ0cGFDYUNzckV4ZXRtd1pOcHN0b2E0eHE5VnE1RkRONnptdVJ2MWZkZkt0WDcrK0xSRk94UzFidG5UYWJEWTFMUzN0YWppeXpXWUw3OW16WjBqQmxQWDE5ZDJscGFWQlJWRjBlbWFPTFJhTHRtN2RPcmZINHduRWV6MU4weUtQUC82NHoyUXlhYjN4Q0dheldYL3NzY2NDemMzTmNWOHZIclp1M1hxUWdjN1dMdUFKZW43cEo2U1hYMzc1eWtnWHd1UHhxTE5uenc0WUZDUlNWbGFtdWx5dXVBTDZ3K0Z3ZU5XcVZWNmo2MlZsWldrMU5UWCtlTXY0OXR0dmQ4dXliQlRWRTZtc3JBd25jczNCMXExYmZ6QzRieEQ0VXhsaDZ2VnJhbVJaanZZbERadjYrbnJmNmRPbkRadU1NMmZPcERrY2pyZ1dDcmUydG5idTM3L2ZjS1dDeCtPUmYvamhoMUE4MXd1SHcrRlBQdmtrWGRkMXcyYjN3SUVEYWFxYU9JTzM1K1dJUmdHVXBDM2E4dnY5YUpwbWVDNFlET0oydStOYXYrUDMrelcvUDlybGRZMUFJQkRYaXlaSmtwU2VuaDZ6WHd3R2cvRmNMbTU2bXRkb0lpQU1odTdlUDNyUk5HM0VqWWJwMDZjckV5Wk1NRnp4WnJmYkl5VWxKVm54WEcvaXhJbVdrcElTdzFjN0l5TWpNblBtekxpOEpZcWlLS3RYcjQ1NXZyUzBOQ0xMaVh1bmRWMDN1bmdJQ01tSVBxbi9tVkJveEp1Ny9QeDg4OU5QUHgxS1MrdnZzMVVVaFlxS0NzMXV0OGRWQTFsWldkblBQLys4MTJLeDlDdXJKRW5Nbno5ZlhiNThlZHd1clJkZmZER2pvcUtpMzRza1NSSkZSVVg2MDA4L3JVZVhmU1NKUkNKR3p4OEVnbW1JTU5kSjlPbVhwazJiNWw2elprMWNiL1pnV0xwMGFWcDJkcmEvdmIxZENRYUQwdFNwVS9YMTY5ZDdYMy85OVhGV3F6VnU3VjJ3WUVGR1lXRmhvTFcxVmZINy9WSitmajVyMTY0TmJ0NjhPWDN5NU1scDhWcjFzaXl6Wk1rU3JidTdXM081WEdsWldWbFVWRlNvSDM3NG9UUno1c3k0cnhjUHRiVzFsM2Z0MmxVUTllOHU0SDlBSkl6b0YrdDl6ejMzT0hSZER5Zktrdkg3L2VGTGx5NTVmRDdmaUppMTRYQllhMnBxOG5aMWRjVnQwY1dpbzZQRDUzUTZrN1pLY2ZQbXpVY1lhTjJkQmhiTHdBbWlWa2VmUEhsUzd1enNiRTNVVzJNeW1aU0NnZ0tyMld3ZWtWbGZSVkhrL1B4OFMzWjI5b2c1aFBQeThzdzJteTFwcmpHSHcyRlVGMDdBS1FNWGlESWNYQzVYNXZIang1T1dPK2QyUjlkMTdjaVJJMGJyYWJ1QUxobVJpU3JhTnM0NmRPaFFLa0lvU1hSMmRyWWVPblJvb3NFcEYrQ1dFVzZodHFpVDhvRURCMUJWTlpEb0FxYUFob1lHajlmcmpiWkdRNGlVYmdFWmtiMmpQdnFMUC8vOHM4bnBkTVkxYWs4UlA1RklSUDNpaXkrTWJIc2ZJaE5ZUkVia3YybGxZTCtVMjlqWW1Jb1VTakErbnk5WVhWMmRhWEFxZ0VpSWlJd3d2MzlHck9HOGlzZmpTZCszYjUvUkhFZUtFY1RoY1BnZERvZlJ1dG1mRU91V2tCRWE5Qi9BU2Zwb2s2N3I4dTdkdTAyYXBxV2F2QVJTWFYzZDdIUTZvMDM5TVBBK1lxWGwxY20rVHNUS3ZuNWV4R1BIamxuMzd0M3JUSFJCYjFmY2JuZlhsaTFiN0F6TU0zdVdhMGxOcmdvcEF1eWtSNzE2Q1lmRDZlKysrMjVlSUJBd2lndExNUXdpa1Vpa3VycTYvY1NKRTVPaVR3SFZpTFZLUVA5cDg1OFJTd0w3VVZ0Ym0vN1ZWMThsMWs5L0crSjJ1NFB2di85K0RnTnovTG1CTHhFcGJpRHFBMDdnRDBSNXhiMWViMXBsWmFWUDA3UlVpTmNJOHQxMzMxMnBxNnVMTmhoMFJMZHppSUZCL0ZlWkNueE8xSFM2eVdSU1AvbmtrM1BKY2piZTZuUjFkWFV2WHJ5NE5icWVFWE43RmR3Z0Y3cUV5TVRsaXZweVpOS2tTYjVMbHk2MWpQWURqblUwVGRNM2JkcmtOQkNRaW1qbUJqV3ZOZ240TEZwSXNpeHJ6ejMzM0RsVlZXL1pKSVBKb0tHaHdWTmNYR3lVZEtNSnNicGxVTWlJWlprRHNxRUFvY3JLeXFPYXBtbWovYkJqa1VBZ29ELzU1Sk0rQXkwS0lCTHJ4dVhVemdQK0FlRS82aWVvN094c2QzVjFkYXAvaWhPZnp4ZCs5ZFZYdlFZaFl5cndEWEIzUEFMcXBSampSTGo2blhmZWViR3hzZkdYU0NSeVN5Vy9UUlNxcW1vZmZQREJaWXZGWXBUNzdqSml2ZktRVUlBSEVZT3FBZEtmTzNldTQ5U3BVNmxNWFRjZ0dBd0dmLy83MzEvTXlja0pHZ2pJRGJ4RlZONk1vUWhxSGNiOWsxNVdWbmF1dmIzOTRxMldUbnFrMEhWZCsraWpqODVhclZhanlOMFFJaDlyeVhBRTFJc1plQlBoTW9yV0tHM1dyRmx0MzMvL2ZlTm9WOGpOaHQvdkQyN2N1TEU1THkvUHlKSlRnZjlsaUhudVltRUJLaEhxT1NCT09qOC8zLzNUVHovOVgwcWpCT0Z3V0gvampUZWF4bzBiWjVUV3M5ZXJzSkFFYlBzd0NmaG5oTGs0UUZCMnV6MjhhZE9tSzZGUXlEUGFsVFNhSEQ1OHVIM2x5cFhkYVdscFJvSC9PbUlXZkJtRDI2UmtTSmlCZDJNSkNsQWZldWloTG9mRDRiemRsQ29VQ3ZrM2J0elltWm1aYVdRZzlBcm9BbEdCcUluQ0R2dzlZa2N1dzhJVUZSVjF2L25tbTVjYkd4czdScnZ5RW8zTDVYTHYzYnYzeW4zMzNlZEtUMDgzM0JZQ3NTSFdINEI1eVJCUUw5bUluVjdPeHloVUJORHZ1T01PNXp2dnZITzhxNnZybGhOV0tCVHEzcmx6NTlHWk0yZWU0L3FiZVhrUit5bVZKRk5BdlZnUVc4Rjl6clhObkF5YndLS2lvaXZQUHZ2c2hjOCsrK3hjVTFOVHM2cXFDVjAxbHlqOGZyKzN2cjYrNWEyMzNtcGNzR0RCSlZtV3U2L3ozR0ZFcHVMZjBTZVowMmdnSVZaSXY0M3hXR3FBazFaUkZQZnExYXQvMkwxNzk1Y3RMUzNuZEYyL3FmMkFYVjFkVFVlT0hEbTBjZVBHcitiT25kdXNLSW9hWTN1RGZrTVRoSlA2VjR5QUJUZFM2cGVKeU4zNkcwUzJyMXh1dkQrc2FyVmF2Vk9uVG5WUG1USWxhTFBaQWxhck5XU3hXS1NwVTZmbXpKa3p4MVphV21yTnk4dExhRllXdjkrdm5UOS8zbi8rL0hsL2ZYMjlzN201MmUvMWVpV24wNWx4OGVMRmpIUG56bVYxZEhUa0lESTZYcSsrZXZ1ZVg0Q1BnZTJJd0ZQamxYT2pSRzl5aUhXSUhTTjdOODY5cm5iMU9YVEVBMm15TEd2cDZlbGFlWGw1dUs2dUxtR2JsTFMxdGJXdFdiT21lOXk0Y2JxaUtGclBkZ1Zhbk9YdTFaeUxpTEhrVEJKb1hvOGt4Y0NMaVA0cWhNRkdKSU05Q2dzTHc5dTJiWE9IUXFFUmF4WjFYZGNPSERod2NmcjA2VGRzb3E5ejZJaCs1eFRDMmwxTzRuZVhUZ2paaUpGMUZjUFl6blQ4K1BIYWpoMDdSaXpkZFYxZDNla3BVNlpFWnhPTzk2Z0gvZ3l4OC9STnMySGtVSkVSTzV2TUFmNFMrQkE0Z25EUng5b01hc0F4Y2VKRXRhcXFxak1jRGc5NUF5MWQxN1dhbWhwSFlXRmhHNE52MHNJSXYrVXB4RmpuRFVUVzV3bUliWXR1cVZCc0NkRWNXQkNiTnQ2SDJKZjJEWVN6c1JGaElYWVRZNi9BOGVQSGgzYnQyalhrT0l1NnVyclRSVVZGc1FTa0kxNmFUc1JBL1FoaWU3ZmZBZzhoV29ROFJIOHo1alVuSGlTRVpWaU1TRnErQUxGWDdkOGg1dndIQ0dyU3BFbis3ZHUzWDRsSG96Uk51NUVHQlJFbTh6SkVqcmw1aUJkcFBHUEVDQmdON0lqTmhRMWRUeE1tVEFoKyt1bW5nOWFvMnRyYVUwVkZSYkg2b0FDd0Y1ak5MZFowSlFNYjhOZGNXNVlUclZHK2p6Lyt1TzE2R3FWcG12YjExMStmTFN3c3ZHSjBEWVNBZHBFUzBMRElCZjRXMFU4WWF0VE9uVHRicjZOQko0dUtpbUtaMlVIZ2o4RDhVWGl1V3c0elFxUGFNZWhQSms2Y0dLcXFxdW9JQm9OcUh3MVNhMnBxemw5SGcwTEFwd3d4UWllRk1TWkVIMlU0TTJ5ejJiVDMzbnV2U1ZYVjFrZ2swclpyMTY2RCtmbjVUcVBQOWh6VmlJMjhVb3d3R2NEZklCWmhHMVc4V2w1ZVh2UGdndy8rTzhKRlkyVEZxWWl4emh4dU16TTZtZVFpdHYyTUphZ3dvcStKTlZDdFJwalhLUUVsbUR4RTAyYzRqb3B4QkJGOTBDekdxSDl0TEdKSEdCT3hOQ3BhUUo4am1yaVVtWjFrN2tDNGxGcUlMU0Evc0lja3h4YWs2SThkZUIzaEFEVVMwR2NJQWFVWVpiSVFWcDhUTWY0Skk0SS9QdVVXYWVMRy9BUDBrSVZ3eks1R3hGeDhDZFFna2x1TmVmNGZVVUorV3ZjNlRKVUFBQUFBU1VWT1JLNUNZSUk9Ii8+CiAgICAgICAgPGltYWdlIGlkPSJfSW1hZ2UyIiB3aWR0aD0iMTc5cHgiIGhlaWdodD0iODlweCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFMTUFBQUJaQ0FZQUFBQjF5eFVYQUFBQUNYQklXWE1BQUE3RUFBQU94QUdWS3c0YkFBQUJZVWxFUVZSNG5PM1dNVW9sUVJTRzBiK2xEVjJFdXhBeEVHUEhaUmhPT2h0d0kwWUdtcGs0MllCdVlqRFVIUmlOakZ5VEI3NVF4YUo1MTNPaW9vTmJWZkJSZEdxODI2cmFDZDlhVloyTkRtMXI2VXZDVjVuWDFqZEovZ3pZNHpISnZ3RnoyU3kva3p3Tm1MdWY1Q1JKc3ZaSy94cXdFUXhWVlQvOVp0Q09tR2xEekxRaFp0b1FNMjJJbVRiRVRCdGlwZzB4MDRhWWFVUE10Q0ZtMmhBemJZaVpOc1JNRzNPU3k5WDY3NUlIZ1UrNnoxdkRBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFPODNWZFgxYW4wK1RkUFZvcWVCRDZxcUgwbE9rMlJPY3J6NmZyZllpZUR6ZHJOcWVHdmhnOENYRVROdGlKazJ4RXdiWXFZTk1kT0dtR2xEekxRaFp0b1FNMjJJbVRiRVRCdGlwZzB4MDRhWWFXTmVXeDlWMWZhQVBSNlNYRXpUOUR4Z05odWlxZzZUSEF3WXZiZSt5V2kzVmJVejRCSnNrS282R3gzYW5HVDBpL2wvOEh3Mncwc0d0L1lLek5YS2NiSmVEbVFBQUFBQVNVVk9SSzVDWUlJPSIvPgogICAgPC9kZWZzPgo8L3N2Zz4K';

const HAT_TIMEOUT = 100;

// Déclaration des locales disponibles pour l'extension
const AvailableLocales = ['en', 'fr', 'de'];

//Traductions des textes utilisés par l'extension
const Message = {
  activateImageclass: {
    'en': 'activate Image Classification',
    'fr': 'activer Image Classification'
  },
  video_toggle: {
    'en': 'turn video [VIDEO_STATE]',
    'fr': 'mettre caméra sur [VIDEO_STATE]'
  },
  on: {
    'en': 'on',
    'fr': 'on'
  },
  off: {
    'en': 'off',
    'fr': 'off'
  },
  onfront: {
    'en': 'front camera on',
    'fr': 'allumer caméra avant',
    'de': 'Frontkamera einschalten'
  },
  onback: {
    'en': 'back camera on',
    'fr': 'allumer caméra arrière',
    'de': 'Rückfahrkamera einschalten'
  },
  off: {
    'en': 'camera off',
    'fr': 'arrêter la caméra',
    'de': 'Stopp Kamera'
  },
  video_on_flipped: {
    'en': 'flip camera image',
    'fr': 'retourner l\'image de la caméra',
    'de': 'Kameraspiegel'
  },
  result1: {
    'en': 'candidate1',
    'fr': 'Prédiction 1'
  },
  result2: {
    'en': 'candidate2',
    'fr': 'Prédiction 2'
  },
  result3: {
    'en': 'candidate3',
    'fr': 'Prédiction 3'
  },
  confidence1: {
    'en': 'confidence1',
    'fr': 'Probabilité 1'
  },
  confidence2: {
    'en': 'confidence2',
    'fr': 'Probabilité 2'
  },
  confidence3: {
    'en': 'confidence3',
    'fr': 'Probabilité 3'
  },
  when_received_block: {
    'en': 'when received classification candidates',
    'fr': 'quand une prédiction est réalisée'
  },
  toggle_classification: {
    'en': 'turn classification [CLASSIFICATION_STATE]',
    'fr': 'mettre la classification sur [CLASSIFICATION_STATE]'
  },
  set_classification_interval: {
    'en': 'Classify once every [CLASSIFICATION_INTERVAL] seconds',
    'fr': 'Faire une prédiction toutes les [CLASSIFICATION_INTERVAL] secondes'
  }
}

// Déclaration de la classe principale pour les blocs de l'apprentissage machine
class Scratch3ImageClassifierBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this.when_received = false;
    this.results = [];
    this.locale = this.setLocale();

    this.blockClickedAt = null;

    this.interval = 1000;

    // Méthode pour détecter les images et charger le modèle de classification
    this.detect = () => {
      this.video = this.runtime.ioDevices.video.provider.video;
      this.classifier = ml5.imageClassifier('MobileNet', () => {
        console.log('Model Loaded!');
        this.timer = setInterval(() => {
          this.classify();
        }, this.interval);
      });
    }

  }

  getInfo() {
    this.locale = this.setLocale();

    return {
      id: 'ic',
      name: 'ImageClassifier',
      blockIconURI: blockIconURI,
      blocks: [
        // Bloc pour activer la classification d'image
        {
          opcode: 'activateImageclass',
          blockType: BlockType.COMMAND,
          text: Message.activateImageclass[this._locale],
        },
        // Blocs pour récupérer les résultats de la classification
        {
          opcode: 'getResult1',
          text: Message.result1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getResult2',
          text: Message.result2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getResult3',
          text: Message.result3[this.locale],
          blockType: BlockType.REPORTER
        },
        // Blocs pour récupérer les probabilités (confiance) des prédictions
        {
          opcode: 'getConfidence1',
          text: Message.confidence1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getConfidence2',
          text: Message.confidence2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getConfidence3',
          text: Message.confidence3[this.locale],
          blockType: BlockType.REPORTER
        },
        // Bloc déclenché quand une classification est reçue
        {
          opcode: 'whenReceived',
          text: Message.when_received_block[this.locale],
          blockType: BlockType.HAT,
        },
        // Bloc pour activer/désactiver la classification
        {
          opcode: 'toggleClassification',
          text: Message.toggle_classification[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_STATE: {
              type: ArgumentType.STRING,
              menu: 'classification_menu',
              defaultValue: 'off'
            }
          }
        },
        // Bloc pour définir l'intervalle de classification
        {
          opcode: 'setClassificationInterval',
          text: Message.set_classification_interval[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_INTERVAL: {
              type: ArgumentType.STRING,
              menu: 'classification_interval_menu',
              defaultValue: '1'
            }
          }
        },
        // Bloc pour gérer l'état de la vidéo
        {
          opcode: 'videoToggle',
          text: Message.video_toggle[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            VIDEO_STATE: {
              type: ArgumentType.STRING,
              menu: 'video_menu',
              defaultValue: 'off'
            }
          }
        },
        // Bloc pour gérer la transparence de la vidéo
        {
          opcode: 'setVideoTransparency',
          text: formatMessage({
            id: 'videoSensing.setVideoTransparency',
            default: 'set video transparency to [TRANSPARENCY]',
            description: 'Controls transparency of the video preview layer'
          }),
          arguments: {
            TRANSPARENCY: {
              type: ArgumentType.NUMBER,
              defaultValue: 50
            }
          }
        }
      ],
      menus: {
        video_menu: this.getVideoMenu(),
        classification_interval_menu: this.getClassificationIntervalMenu(),
        classification_menu: this.getClassificationMenu()
      }
    };
  }

  getResult1() {
    return this.results[0] ? this.results[0]['label'] : '';
  }

  getResult2() {
    return this.results[1] ? this.results[1]['label'] : '';
  }

  getResult3() {
    return this.results[2] ? this.results[2]['label'] : '';
  }

  getConfidence1() {
    return this.results[0] ? this.results[0]['confidence'] : '';
  }

  getConfidence2() {
    return this.results[1] ? this.results[1]['confidence'] : '';
  }

  getConfidence3() {
    return this.results[2] ? this.results[2]['confidence'] : '';
  }

  whenReceived(args) {
    if (this.when_received) {
      setTimeout(() => {
        this.when_received = false;
      }, HAT_TIMEOUT);
      return true;
    }
    return false;
  }

  toggleClassification(args) {
    if (this.actionRepeated()) {
      return
    };

    let state = args.CLASSIFICATION_STATE;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (state === 'on') {
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    }
  }

  setClassificationInterval(args) {
    if (this.actionRepeated()) {
      return
    };

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.interval = args.CLASSIFICATION_INTERVAL * 1000;
    this.timer = setInterval(() => {
      this.classify();
    }, this.interval);
  }

  activateImageclass(args) {
    if (!this.runtime.ioDevices.video.videoReady) {
      alert('Il faut d\'abord activer la vidéo');
    } else {
      this.detect();
    }

  }

  classify() {
    this.classifier.classify(this.video, (err, results) => {
      if (err) {
        console.error(err);
      } else {
        this.when_received = true;
        this.results = results;
      }
    });
  }

  actionRepeated() {
    let currentTime = Date.now();
    if (this.blockClickedAt && (this.blockClickedAt + 250) > currentTime) {
      console.log('Please do not repeat trigerring this block.');
      this.blockClickedAt = currentTime;
      return true;
    } else {
      this.blockClickedAt = currentTime;
      return false;
    }
  }

  // Menu pour gérer l'état de la caméra vidéo
  get VIDEO_MENU() {
    return [
      'onback', 'onfront', 'video_on_flipped', 'off'
    ].map(key => ({
      text: Message[key][this.locale],
      value: key
    }));
  }

  getClassificationIntervalMenu() {
    return [{
        text: '5',
        value: '5'
      },
      {
        text: '2',
        value: '2'
      },
      {
        text: '1',
        value: '1'
      },
      {
        text: '0.5',
        value: '0.5'
      }
    ]
  }

  getClassificationMenu() {
    return [{
        text: Message.off[this.locale],
        value: 'off'
      },
      {
        text: Message.on[this.locale],
        value: 'on'
      }
    ]
  }

  // Fonction permettant d'activer la vidéo et de changer de caméra
  videoToggle(args) {
    if (this.actionRepeated()) {
      return
    };
    switch (args.VIDEO_STATE) {
      case 'off':
        this.runtime.ioDevices.video.disableVideo();
        break;
      case 'onback':
        this.runtime.ioDevices.video.enableVideo('environment');
        this.runtime.ioDevices.video.mirror = false;
        this.active = true;
        break;
      case 'onfront':
        this.runtime.ioDevices.video.enableVideo('user');
        this.runtime.ioDevices.video.mirror = true;
        this.active = true;
        break;
      default:
        this.runtime.ioDevices.video.mirror = !this.runtime.ioDevices.video.mirror;
    }

  }

  // Fonction permettant de changer la transparence d'affichage de la caméra sur la scène
  setVideoTransparency(args) {
    const transparency = Cast.toNumber(args.TRANSPARENCY);
    this.globalVideoTransparency = transparency;
    this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }

  // Fonction permettant de définir la langue de l'extension en fonction de la langue définit dans Scratch.
  // Si la traduction d'une langue n'est pas disponible dans l'extension, c'est l'anglais qui est choisi
  setLocale() {
    let locale = formatMessage.setup().locale;
    return AvailableLocales.includes(locale) ? locale : 'en';
  }
}

module.exports = Scratch3ImageClassifierBlocks;