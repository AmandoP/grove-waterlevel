/**
 * Wasserstandssensor (Grove MMR006)
 */
//% color=#00AEEF icon="\uf043" block="Wasserstand"
namespace WaterLevel {
    let lowData: Buffer
    let highData: Buffer

    /**
     * Gibt die Anzahl aktiver Segmente (0–20) zurück
     */
    //% block
    export function aktiveSegmente(): number {
        let touched = 0

        lowData = readI2CBuffer(0x77, 8)
        highData = readI2CBuffer(0x78, 12)

        for (let i = 0; i < 8; i++) {
            if (lowData.getNumber(NumberFormat.UInt8LE, i) > 100) {
                touched += 1
            }
        }

        for (let j = 0; j < 12; j++) {
            if (highData.getNumber(NumberFormat.UInt8LE, j) > 100) {
                touched += 1
            }
        }

        return touched
    }

    /**
     * Gibt den prozentualen Wasserstand (0–100%) zurück
     */
    //% block
    export function prozent(): number {
        const touched = aktiveSegmente()
        return touched * 100 / 20
    }

    function readI2CBuffer(address: number, length: number): Buffer {
        pins.i2cWriteNumber(address, 0, NumberFormat.UInt8BE, false)
        return pins.i2cReadBuffer(address, length, false)
    }
}
