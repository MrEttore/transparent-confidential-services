import http from 'k6/http';
import { check } from 'k6';
import exec from 'k6/execution';

const BASE_URL = 'http://127.0.0.1:8081';
const ENDPOINT = '/verify/workloads';
const ENDPOINT_TAG = 'verify-workloads';

const payload = open('./test-payloads/workloads.json');

function postOnce() {
  const url = `${BASE_URL}${ENDPOINT}`;
  const res = http.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '120s',
  });

  const ok = check(res, {
    'status is 2xx': (r) => r.status >= 200 && r.status < 300,
  });

  if (!ok) {
    console.error(
      `FAIL endpoint=${ENDPOINT_TAG} phase=${exec.scenario.name} status=${
        res.status
      } body=${String(res.body).slice(0, 300)}`,
    );
  }
}

export const options = {
  scenarios: {
    warmup: {
      executor: 'constant-arrival-rate',
      rate: 1,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 5,
      maxVUs: 50,
      tags: { endpoint: ENDPOINT_TAG, phase: 'warmup' },
    },
    baseline: {
      executor: 'constant-arrival-rate',
      startTime: '1m',
      rate: 10,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 15,
      maxVUs: 250,
      tags: { endpoint: ENDPOINT_TAG, phase: 'baseline' },
    },
    ramp: {
      executor: 'ramping-arrival-rate',
      startTime: '4m',
      timeUnit: '1s',
      preAllocatedVUs: 30,
      maxVUs: 800,
      stages: [
        { duration: '2m', target: 25 },
        { duration: '2m', target: 50 },
        { duration: '2m', target: 75 },
      ],
      tags: { endpoint: ENDPOINT_TAG, phase: 'ramp' },
    },
  },
  thresholds: {
    'http_req_failed{phase:baseline}': ['rate<0.001'],
    'dropped_iterations{phase:baseline}': ['count==0'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  postOnce();
}
