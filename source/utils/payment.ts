import path from 'path';
import axios from 'axios';
import { CustomErrorClass } from './customError.js';

interface IAsanpardakhtInitResponse {
    refId: string,
    invoiceId: number,
    code: number
}

export async function createNewPayment(amount: number, callback: string): Promise<string | object> {
    let data = {
        amount: amount,
        invoiceId: Date.now(),
        additionalData: `evc simcard/charge`,
        callback: "https://api.test.evipclub.org/simcard/charge/payment/verify/asanpardakht",
    };
    console.log('data is : ', data)
    const asanpardakhtResponse: IAsanpardakhtInitResponse =
        await axios
            .post(
                `${process.env.ASAN_PARDAKHT}/ipg/init`,
                data
            )
            .then((res) => {
                console.log('response is: ', res.data)
                // this.logger.log(`AsanPardakhtPaymentGateway|${res.data}|${icreatepayment.amount}`)
                // icreatepayment.resNum = data.invoiceId.toString();
                return res.data
            })
            .catch((e) => {
                return CustomErrorClass.internalError();
            });
    return asanpardakhtResponse;
}