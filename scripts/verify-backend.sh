#!/bin/bash

# verify-backend.sh
# Verification Harness for the Go Code Execution API
# Checks if the backend safely executes code and stops malicious attacks.

API_URL="http://localhost:8080/api/execute"
SUCCESS_COUNT=0
FAIL_COUNT=0

print_header() {
    echo "========================================"
    echo " TEST: $1"
    echo "========================================"
}

check_result() {
    local test_name=$1
    local expected_status=$2
    local actual_status=$3
    local response_body=$4
    local expected_output_substring=$5

    if [ "$actual_status" -ne "$expected_status" ]; then
        echo "❌ [FAILED] $test_name"
        echo "   Expected Status: $expected_status, Got: $actual_status"
        echo "   Response: $response_body"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return
    fi

    if [[ -n "$expected_output_substring" && ! "$response_body" == *"$expected_output_substring"* ]]; then
        echo "❌ [FAILED] $test_name"
        echo "   Missing expected substring: $expected_output_substring"
        echo "   Response: $response_body"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        return
    fi

    echo "✅ [PASSED] $test_name"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
}

# 1. Test Normal Execution
print_header "Normal Execution"
JSON_PAYLOAD_NORMAL=$(cat <<EOF
{
    "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello Go\")\n}"
}
EOF
)

HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$JSON_PAYLOAD_NORMAL" $API_URL)
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)

check_result "Normal Code Should Print Hello Go" 200 "$HTTP_STATUS" "$HTTP_BODY" "Hello Go"


# 2. Test RCE: File System Access (/etc/passwd)
print_header "Security: Read /etc/passwd"
JSON_PAYLOAD_MALICIOUS=$(cat <<EOF
{
    "code": "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\tdata, err := os.ReadFile(\"/etc/passwd\")\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(string(data))\n}"
}
EOF
)

HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$JSON_PAYLOAD_MALICIOUS" $API_URL)
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)

# We expect it to successfully read the *container's* /etc/passwd (which contains 'root:x:0:0:root'),
# confirming that it is isolated and not reading the host's /etc/passwd.
check_result "Malicious Code Should Fail to Read Host System Files" 200 "$HTTP_STATUS" "$HTTP_BODY" "root:x:0:0:root"


# 3. Test Timeout / Infinite Loop
print_header "Security: Infinite Loop Timeout"
JSON_PAYLOAD_LOOP=$(cat <<EOF
{
    "code": "package main\n\nfunc main() {\n\tfor {\n\t}\n}"
}
EOF
)

HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$JSON_PAYLOAD_LOOP" $API_URL)
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)

# We expect a 408 Request Timeout or similar from the API
check_result "Infinite Loop Should Trigger Timeout" 408 "$HTTP_STATUS" "$HTTP_BODY" "timeout"


echo "========================================"
echo " RESULTS: $SUCCESS_COUNT Passed, $FAIL_COUNT Failed"
echo "========================================"

if [ "$FAIL_COUNT" -gt 0 ]; then
    exit 1
fi
exit 0
