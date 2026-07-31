// ================================
// نتيجة الثانوية العامة 2026
// Ahmed Qonswa
// ================================

const cache = {};

// البحث عند الضغط على Enter
document.getElementById("seatNumber").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchResult();
    }
});

async function searchResult() {

    const input = document.getElementById("seatNumber");
    const result = document.getElementById("result");
    const loading = document.getElementById("loading");

    const seat = input.value.trim();

    result.innerHTML = "";

    if (seat === "") {
        alert("من فضلك أدخل رقم الجلوس");
        input.focus();
        return;
    }

    // أول 3 أرقام
    const prefix = seat.substring(0, 3);

    loading.style.display = "block";

    try {

        let data;

        // لو الملف اتحمل قبل كده نستخدمه من الكاش
        if (cache[prefix]) {

            data = cache[prefix];

        } else {

            const response = await fetch(`data/splitted/${prefix}.json`);

            if (!response.ok) {
                throw new Error("File Not Found");
            }

            data = await response.json();

            cache[prefix] = data;
        }

        loading.style.display = "none";

        const student = data[seat];

        if (!student) {

            result.innerHTML = `
                <div class="error">
                    رقم الجلوس غير موجود
                </div>
            `;

            return;
        }

        const total = parseFloat(student.total_degree);

        const percentage = ((total / 320) * 100).toFixed(2);

        let grade = "";

        if (percentage >= 85)
            grade = "ممتاز";
        else if (percentage >= 75)
            grade = "جيد جداً";
        else if (percentage >= 65)
            grade = "جيد";
        else if (percentage >= 50)
            grade = "مقبول";
        else
            grade = "راسب";

        result.innerHTML = `

<div class="card">

<h2>${student.arabic_name}</h2>

<div class="row">
<div class="label">رقم الجلوس</div>
<div class="value">${student.seating_no}</div>
</div>

<div class="row">
<div class="label">المجموع</div>
<div class="value">${student.total_degree} / 320</div>
</div>

<div class="row">
<div class="label">النسبة</div>
<div class="value">${percentage}%</div>
</div>

<div class="row">
<div class="label">التقدير</div>
<div class="value">${grade}</div>
</div>

<div class="row">
<div class="label">الحالة</div>
<div class="value success">${student.student_case_desc}</div>
</div>

</div>

`;

    } catch (e) {

        loading.style.display = "none";

        result.innerHTML = `
            <div class="error">
                حدث خطأ أثناء تحميل البيانات
            </div>
        `;

        console.error(e);
    }
}