"use client"


export default function Home() {
  async function testingBackend() {
    try {
      const response = await fetch("http://localhost:8080/health");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <div className="flex items-center">
      <button onClick={testingBackend} className="p-5 border-amber-50">
        checking api
      </button>
    </div>
  );
}
