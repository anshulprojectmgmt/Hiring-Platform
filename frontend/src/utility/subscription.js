import BASE_URL from "../Api";

export async function checkSubscription() {
  const token = localStorage.getItem("token");
  if (!token) return { status: "inactive" };
  try {
    const res = await fetch(`${BASE_URL}/api/payment/subscription-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { status: "inactive" };
  }
}
