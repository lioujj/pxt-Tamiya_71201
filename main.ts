/**
 *Tamiya 71201 Microcomputer Robot
 */
//% weight=0 color=#3CB371 icon="\uf1b9" block="Tamiya_71201"
namespace Tamiya_71201  {

    const stopValue = 511
    pins.analogSetPitchPin(AnalogPin.P8)
    export enum Directions {
        //% block="foreward"
        foreward = 1,
        //% block="backward"
        backward = 2,
        //% block="counterclockwise"
        leftward = 3,
        //% block="clockwise"
        rightward = 4
    }
    export enum rotateDir {
        //% block="foreward"
        foreward = 1,
        //% block="backward"
        backward = 2
    }
    export enum motor {
        //% block="left"
        left = 1,
        //% block="right"
        right = 2
    }
    export enum unit {
        //% block="cm"
        cm = 1,
        //% block="mm"
        mm = 2
    }


    /**
    * 移動 Robot 左右馬達同時轉動
    * move The Robot
    */
    //% blockId="moveAll" block="Robot move %myDir|speed(0~511) %power"
    //% power.min=0 power.max=511 weight=95
    export function moveAll(myDir: Directions, power: number): void {
        if (power < 0)
            power = 0
        else if (power > stopValue)
            power = stopValue
        switch (myDir) {
            case 1:
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
                pins.analogWritePin(AnalogPin.P13, power + stopValue)
                pins.analogWritePin(AnalogPin.P14, power + stopValue)
                break
            case 2:
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
                pins.analogWritePin(AnalogPin.P13, stopValue - power)
                pins.analogWritePin(AnalogPin.P14, stopValue - power)
                break
            case 3:
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
                pins.analogWritePin(AnalogPin.P13, power + stopValue)
                pins.analogWritePin(AnalogPin.P14, stopValue - power)
                break
            case 4:
                pins.digitalWritePin(DigitalPin.P15, 0)
                pins.digitalWritePin(DigitalPin.P16, 0)
                pins.analogWritePin(AnalogPin.P13, stopValue - power)
                pins.analogWritePin(AnalogPin.P14, power + stopValue)
                break
            default:
                pins.digitalWritePin(DigitalPin.P15, 1)
                pins.digitalWritePin(DigitalPin.P16, 1)
                break
        }
    }

    /**
    * 停止 Robot
    * stop the Robot
    */
    //% blockId="stop" block="Robot stop"
    //% weight=90
    export function stop(): void {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P16, 1)
    }
    /**
    * 移動 Robot 單一馬達
    * rotate single motor
    */
    //% blockId="motorRotate" block="rotate single motor: %myMotor | %myDir | speed(0~511) %power"
    //% power.min=0 power.max=511 weight=85
    export function motorRotate(myMotor: motor, myDir: rotateDir, power: number): void {
        let motorPin = AnalogPin.P14
        let dirPin = DigitalPin.P16
        if (power < 0)
            power = 0
        else if (power > stopValue)
            power = stopValue
        switch (myMotor) {
            case 1:
                motorPin = AnalogPin.P14
                dirPin = DigitalPin.P16
                break
            case 2:
                motorPin = AnalogPin.P13
                dirPin = DigitalPin.P15
                break
            default:
                motorPin = AnalogPin.P14
                dirPin = DigitalPin.P16
                break
        }
        switch (myDir) {
            case 1:
                pins.digitalWritePin(dirPin, 0)
                pins.analogWritePin(motorPin, power + stopValue)
                break
            case 2:
                pins.digitalWritePin(dirPin, 0)
                pins.analogWritePin(motorPin, stopValue - power)
                break
            default:
                pins.digitalWritePin(dirPin, 1)
                pins.analogWritePin(motorPin, stopValue)
                break
        }
    }
    /**
    * 停止單一馬達
    * stop single motor
    */
    //% blockId="stopSingleMotor" block="stop single motor: %myMotor"
    //% weight=80
    export function stopSingleMotor(myMotor: motor): void {
        let motorPin = AnalogPin.P14
        let dirPin = DigitalPin.P16
        switch (myMotor) {
            case 1:
                motorPin = AnalogPin.P14
                dirPin = DigitalPin.P16
                break
            case 2:
                motorPin = AnalogPin.P13
                dirPin = DigitalPin.P15
                break
            default:
                motorPin = AnalogPin.P14
                dirPin = DigitalPin.P16
                break
        }
        pins.digitalWritePin(dirPin, 1)
        pins.analogWritePin(motorPin, 511)
    }

    /**
    * 超音波取得前方距離,(-1代表偵測不到) 
    * get the distance from Ultrasonic sensor to the obstacle (-1 means nothing detected)
    */
    //% blockId="getDistance" block="get the distance before Robot in %myUnit"
    //% weight=75
    export function getDistance(myUnit: unit): number {
        const I2C_addr = 44
        let lowByte = 0
        let highByte = 0
        let buff = 0
        let length = 0
        let pingTime = input.runningTime()
        while (highByte == 0 && lowByte == 0 && input.runningTime() - pingTime < 50) {
            pins.i2cWriteNumber(I2C_addr, 51, NumberFormat.UInt8BE, false)
            buff = pins.i2cReadNumber(I2C_addr, NumberFormat.UInt8BE, false)
            if (buff == 1) {
                basic.pause(6)
                pins.i2cWriteNumber(I2C_addr, 16, NumberFormat.UInt8BE, false)
                buff = pins.i2cReadNumber(I2C_addr, NumberFormat.UInt8BE, false)
                basic.pause(1)
                pins.i2cWriteNumber(I2C_addr, 15, NumberFormat.UInt8BE, false)
                highByte = pins.i2cReadNumber(I2C_addr, NumberFormat.UInt8BE, false)
                basic.pause(1)
                pins.i2cWriteNumber(I2C_addr, 14, NumberFormat.UInt8BE, false)
                lowByte = pins.i2cReadNumber(I2C_addr, NumberFormat.UInt8BE, false)
                if (buff != Math.constrain(highByte + lowByte, 0, 255)) {
                    highByte = 0
                    lowByte = 0
                }
            }
        }
        length = (highByte * 256 + lowByte - 160) / 2 * 0.315
        if (myUnit == 1)
            length = (length / 10)
        if (length < 0)
            length = -1
        return Math.round(length)
    }
}
