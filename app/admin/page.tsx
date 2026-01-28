import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminView from "@/app/views/AdminView";

export default async function AdminPage() {
  // Get cookies
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");
  const userRole = cookieStore.get("userRole");

  // Check if user is authenticated
  if (!userId || !userRole) {
    redirect("/login");
  }

  // Check if user has admin role
  if (userRole.value !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#2d2a27] flex items-center justify-center">
        <div className="bg-white dark:bg-[#3e3a36] rounded-[2.5rem] p-12 shadow-xl max-w-md text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-black text-[#3e3a36] dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            You Don't Have Access to This Page
          </p>
          <a
            href="/home"
            className="inline-block px-8 py-3 bg-[#c8a47e] text-white font-bold rounded-2xl hover:bg-[#b89365] transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return <AdminView />;
}
