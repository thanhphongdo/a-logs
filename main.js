const axios = require('./axios');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { flow: 'Consumer Application' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

const baseSharedUrl = 'https://acb-dev-shared-gateway.creditstrong.com';
const baseConsumerUrl = 'https://acb-dev-consumer-gateway.creditstrong.com';
// const baseSharedUrl = 'https://acb-qa-shared-gateway.creditstrong.com';
// const baseConsumerUrl = 'https://acb-qa-consumer-gateway.creditstrong.com';
// const baseSharedUrl = 'https://229a-2402-800-63a8-9d23-f820-e93e-9c81-285a.ap.ngrok.io';
// const baseConsumerUrl = 'https://229a-2402-800-63a8-9d23-f820-e93e-9c81-285a.ap.ngrok.io';

function randomId(maxLength) {
    let id = '';
    while (id.length < maxLength) {
        id += Math.random().toString(36).substring(2);
    }
    return id.substr(0, maxLength);
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function step1_load_lead() {
    return axios.post(`${baseSharedUrl}/customer/public/flows/lead/load`);
}

function step2_lead_welcome(leadUuid, email) {
    const leadData = {
        email,
        firstName: 'carol',//randomId(10),
        lastName: 'Do',//randomId(10),
        leadUuid
    };

    return axios.post(`${baseSharedUrl}/customer/public/flows/lead/welcome`, JSON.stringify(leadData));
}

function step3_lead_dob(leadUuid) {
    const leadData = {
        leadUuid,
        dateOfBirth: '1992-12-12'
    };

    return axios.post(`${baseSharedUrl}/customer/public/flows/lead/dob`, JSON.stringify(leadData));
}

function step4_lead_phone(leadUuid) {
    const leadData = {
        leadUuid,
        mobilePhoneNumber: `${randomNumber(100, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`
    };

    return axios.post(`${baseSharedUrl}/customer/public/flows/lead/mobile-phone`, JSON.stringify(leadData));
}

function step5_lead_address(leadUuid, email) {
    const leadData = {
        leadUuid,
        addressLine1: '12040 AURORA AVE n',
        addressLine2: '',
        city: 'seattle',
        email,
        lastTouchStep: 'ADDRESS',
        state: 'WA',
        zipCode: 98133
    };

    return axios.post(`${baseSharedUrl}/customer/public/flows/lead/address`, JSON.stringify(leadData));
}

function step6_lead_password(leadUuid) {
    const leadData = {
        leadUuid,
        // password: `1${randomId(3)}!${randomId(3)}A${randomId(4)}}`
        password: `Test!234`
    };

    return axios.post(`${baseSharedUrl}/customer/public/flows/lead/password`, JSON.stringify(leadData));
}

function step7_login(email) {
    const data = `username=${email}&password=Test!234&grant_type=password&client_id=customer-portal&baseUrl=http://localhost:4400`;

    return axios.post(`${baseSharedUrl}/auth/oauth/token`, data, {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'authorization': 'Basic Y3VzdG9tZXItcG9ydGFsOjEwYTIxOTBkYWYwNzc0ZDY1ZDdkNmFjNjYxYTBkYTk1OGViNWI2ZmY='
    });
}

function step8_ssn(applicantId, applicationId, ssn, token) {
    const applicantData = {
        id: applicantId,
        ssn
    };

    return axios.patch(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/ssn`, JSON.stringify(applicantData), {
        authorization: `Bearer ${token}`
    });
}

function step9_sentilink(applicantId, applicationId, email, ssn, token) {
    const applicantData = {
        zoneBySsn: '111-11-1100',
        ssn,
        email,
        firstName: 'carol',
        lastName: 'Do',
        middleInitial: null,
        birthDate: '1992-12-12'
    };

    return axios.post(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/sentilink`, JSON.stringify(applicantData), {
        authorization: `Bearer ${token}`
    });
}

function step10_factor_trust(applicantId, applicationId, token) {
    return axios.get(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/factortrust`, {}, {
        authorization: `Bearer ${token}`
    });
}

function step11_select_offer(applicantId, applicationId, token) {
    const applicantData = {
        "id": 8,
        "uuid": "527c8bbb-8d5b-40f7-86a4-00212230bc59",
        "monthlyPayment": 45,
        "loanAmount": 505,
        "loanApr": 15.6,
        "savingsAmount": 505,
        "savingsApy": 0.2,
        "term": 12,
        "adminFee": 8,
        "disabled": false,
        "name": "Micro",
        "code": "micro-12",
        "states": [],
        "latePaymentGracePeriod": 14,
        "dishonoredFee": 14,
        "lateFeePercentage": 4,
        "loanInterestRate": 12.56,
        "savingsInterestRate": 0.2,
        "contractTemplate": "DefaultContract2.odt",
        "scoreOptions": [],
        "productBrandingName": "Micro",
        "type": 0,
        "active": true,
        "savingsInformation": {
            "backupWithholding": false,
            "beneficiaryChecked": false,
            "fatcaCode": "",
            "specificDetailsSelection": null,
            "taxIdNumberChecked": true,
            "usCitizen": true
        }
    };

    return axios.put(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/selectedoffer`, JSON.stringify(applicantData), {
        authorization: `Bearer ${token}`
    });
}

function step12_payment_method(applicantId, applicationId, token) {
    const applicantData = {"paypageRegistrationId":"5760311187832973287","bin":"411111","type":"VI","targetServer":"primary","vantivTxnId":"83987723340285287","orderId":"eeayv0zou3h1i7ae7e","response":"870","responseTime":"2021-11-12 04:05:35","message":"Success","reportGroup":"ACBGrp1","id":"4gvqusnj7879y718zq5kvtb0o","firstSix":"411111","lastFour":"1111","name":"PD","billingZipCode":"12341","expMonth":"12","expYear":"22"};

    return axios.post(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/payment`, JSON.stringify(applicantData), {
        authorization: `Bearer ${token}`
    });
}

function step13_next_link_payment(applicantId, applicationId, token) {
    return axios.post(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/nextsteplinkpayment`, JSON.stringify({}), {
        authorization: `Bearer ${token}`
    });
}

function step14_get_contract(applicantId, applicationId, token) {
    return axios.get(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/contract`, {}, {
        authorization: `Bearer ${token}`
    });
}

function step15_sign_contract(applicantId, applicationId, token) {
    return axios.post(`${baseConsumerUrl}/origination/consumer/applicants/${applicantId}/applications/${applicationId}/contract`, JSON.stringify({}), {
        authorization: `Bearer ${token}`
    });
}

async function createApplication() {
    try {
        const startTime = Date.now();
        const step1Data = await step1_load_lead();
        const email = `pgsw_${randomNumber(100, 100000)}@yopmail.com`;
        const leadUuid = step1Data.leadUuid;
        const step2Data = await step2_lead_welcome(leadUuid, email);
        const step3Data = await step3_lead_dob(leadUuid);
        const step4Data = await step4_lead_phone(leadUuid);
        const step5Data = await step5_lead_address(leadUuid, email);
        const step6Data = await step6_lead_password(leadUuid);
        const step7Data = await step7_login(email);
        const applicantId = step6Data.applicantId;
        const applicationId = step6Data.applicationId;
        const ssn = `${randomNumber(100, 999)}-${randomNumber(10, 99)}-${randomNumber(1000, 9999)}`;
        const token = step7Data.access_token;
        const step8Data = await step8_ssn(applicantId, applicationId, ssn, token);
        const step9Data = await step9_sentilink(applicantId, applicationId, email, ssn, token);
        const step10Data = await step10_factor_trust(applicantId, applicationId, token);
        const step11Data = await step11_select_offer(applicantId, applicationId, token);
        // const step12Data = await step12_payment_method(applicantId, applicationId, token);
        // const step13Data = await step13_next_link_payment(applicantId, applicationId, token);
        // const step14Data = await step14_get_contract(applicantId, applicationId, token);
        // const step15Data = await step15_sign_contract(applicantId, applicationId, token);
        const endTime = Date.now();
        const message = `Application: ${email} - ${step6Data.applicantId} - ${applicationId} - ${step6Data.customerUuid} - ${(endTime - startTime) / 1000} - ${new Date().toISOString()}`;
        console.log(message);
        logger.log({
            level: 'info',
            message
        });
    }
    catch (err) {
        console.log('ERROR...');
    }
}

// setInterval(() => {
//     console.log('-=-=-=-=-=-BLOCK-=-=-=-=-=')
//     for (var i = 0; i < 5; i++) {
//         createApplication();
//     }
// }, 40000)

createApplication();