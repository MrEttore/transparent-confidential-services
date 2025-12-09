import http from 'k6/http';

const payload = open('./test-payloads/workloads.json');
const BASE_URL = '_YOUR_BASE_URL_HERE_';

export const options = {
    stages: [
        { duration: '30s', target: 1 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 20 },
        { duration: '30s', target: 50 },
    ],
};

export default function () {
    const url = `${BASE_URL}/verify/workloads`;

    const res = http.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
    });
}
