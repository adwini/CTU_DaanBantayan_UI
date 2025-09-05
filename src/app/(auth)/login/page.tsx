import { LoginForm } from "@/components/auth/login-form";
import Footer from "@/components/footer/footer.component";

export default function Page() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}

// spring.datasource.url=jdbc:postgresql://dpg-d2td0aeuk2gs73cor6k0-a.singapore-postgres.render.com:5432/ctulivedb
// spring.datasource.username=ctulivedb_user
// spring.datasource.password=o0bb1Tbe4q4VqdXAONRNsGsKis2MlpC5
// spring.datasource.driver-class-name=org.postgresql.Driver

// JWT_SECRET=u0/NwCrGX3W689T+kYhwXjvjt/DlX6MFoVz276Lzcuc=

// JWT_ACCESS_TOKEN_VALIDITY_SECONDS=900
// JWT_REFRESH_TOKEN_VALIDITY_SECONDS=604800

// COOKIE_VALIDITY_SECONDS=604800
