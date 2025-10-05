import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://passop-wr4s.onrender.com";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "", _id: null });
  const [passwordArray, setPasswordArray] = useState([]);

  const getToken = () => localStorage.getItem("token");

  const getPasswords = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/passwords`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("GET /passwords failed:", res.status, txt);
        return;
      }
      const passwords = await res.json();
      setPasswordArray(passwords);
    } catch (err) {
      console.error("Error fetching passwords:", err);
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!", { position: "top-right", autoClose: 2000 });
  };

  const showPassword = () => {
    if (!passwordRef.current || !ref.current) return;
    if (ref.current.src.includes("icons/hide.png")) {
      ref.current.src = "icons/dontshow.png";
      passwordRef.current.type = "text";
    } else {
      ref.current.src = "icons/hide.png";
      passwordRef.current.type = "password";
    }
  };

  const savePassword = async () => {
    if (form.site.length < 3 || form.username.length < 3 || form.password.length < 3) {
      toast("Error: fill all fields");
      return;
    }

    const token = getToken();
    if (!token) {
      toast("Not logged in");
      return;
    }

    try {
      let res, data;

      if (form._id) {
        // Update existing password
        res = await fetch(`${BASE_URL}/passwords/${form._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ site: form.site, username: form.username, password: form.password }),
        });
        if (!res.ok) throw new Error(await res.text());
        data = await res.json();

        // Update the local state: replace old entry with updated
        setPasswordArray((prev) => [
          { ...form },
          ...prev.filter((p) => p._id !== form._id),
        ]);
      } else {
        // Add new password
        res = await fetch(`${BASE_URL}/passwords`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ site: form.site, username: form.username, password: form.password }),
        });
        if (!res.ok) throw new Error(await res.text());
        data = await res.json();

        const insertedId = data?.result?.insertedId || data?.result?._id || null;
        setPasswordArray((prev) => [{ ...form, _id: insertedId }, ...prev]);
      }

      setForm({ site: "", username: "", password: "", _id: null });
      toast("Password saved!", { position: "top-right", autoClose: 2000 });
    } catch (err) {
      console.error("Error saving password:", err);
      toast("Save failed");
    }
  };

  const deletePassword = async (id) => {
    const token = getToken();
    if (!token) {
      toast("Not logged in");
      return;
    }

    if (!window.confirm("Do you really want to delete this password?")) return;

    try {
      const res = await fetch(`${BASE_URL}/passwords/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("DELETE /passwords failed:", res.status, txt);
        toast("Delete failed");
        return;
      }

      const data = await res.json();
      if (!data.success) {
        toast(data.message || "Delete failed");
        return;
      }

      setPasswordArray((prev) => prev.filter((p) => p._id !== id));
      toast("Password deleted permanently!", { position: "top-right", autoClose: 2000 });
    } catch (err) {
      console.error("Error deleting password:", err);
      toast("Delete failed");
    }
  };

  const editPassword = (item) => {
    // Remove the item immediately
    setPasswordArray((prev) => prev.filter((p) => p._id !== item._id));
    // Fill form with existing details for editing
    setForm({ ...item });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
       <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
      <div className="absolute top-0 z-[-2] min-h-screen w-screen rotate-180 transform bg-[radial-gradient(60%_120%_at_50%_50%,transparent_0,rgba(185,255,200,0.6)_100%)] opacity-100 blur-[80px]"></div>

      <div className="p-3 md:mycontainer min-h-[88.2vh]">
        <h2 className="text-4xl font-bold text-center">
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h2>
        <p className="text-green-900 text-lg text-center">Your Own Password Manager</p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            name="site"
          />
          <div className="flex flex-col md:flex-row w-full gap-8 justify-between">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="rounded-full border border-green-500 w-full p-4 py-1"
              type="text"
              name="username"
            />
            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="rounded-full border border-green-500 w-full p-4 py-1"
                type="password"
                name="password"
              />
              <span className="absolute right-2 top-2 cursor-pointer" onClick={showPassword}>
                <img ref={ref} width={20} src="icons/hide.png" alt="" />
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center gap-2 items-center bg-green-400 rounded-full px-8 py-2 w-fit border border-green-900 hover:bg-green-300"
          >
            <lord-icon src="https://cdn.lordicon.com/efxgwrkc.json" trigger="hover" />
            Save
          </button>
        </div>

        <div className="passwords">
          <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 ? (
            <div>NO Passwords to show</div>
          ) : (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Sites</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item) => (
                  <tr key={item._id}>
                    <td className="py-2 border border-white text-center">
                      <div className="flex justify-center items-center">
                        <a href={item.site} target="_blank" rel="noreferrer">
                          {item.site}
                        </a>
                        <div className="copyy w-5 h-5 cursor-pointer" onClick={() => copyText(item.site)}>
                          <lord-icon src="https://cdn.lordicon.com/cfkiwvcc.json" trigger="hover" style={{ width: "17px", height: "17px" }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center" onClick={() => copyText(item.username)}>
                        <span>{item.username}</span>
                        <div className="copyy w-5 h-5 cursor-pointer">
                          <lord-icon src="https://cdn.lordicon.com/cfkiwvcc.json" trigger="hover" style={{ width: "17px", height: "17px" }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center">
                      <div className="flex items-center justify-center">
                        <span>{"•".repeat(item.password.length)}</span>
                        <div className="copyy w-5 h-5 cursor-pointer" onClick={() => copyText(item.password)}>
                          <lord-icon src="https://cdn.lordicon.com/cfkiwvcc.json" trigger="hover" style={{ width: "17px", height: "17px" }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 border border-white text-center flex justify-center gap-2">
                      <span className="cursor-pointer" onClick={() => editPassword(item)}>
                        <lord-icon src="https://cdn.lordicon.com/valwmkhs.json" trigger="hover" style={{ width: "25px", height: "25px" }} />
                      </span>
                      <span className="cursor-pointer" onClick={() => deletePassword(item._id)}>
                        <lord-icon src="https://cdn.lordicon.com/oqeixref.json" trigger="hover" style={{ width: "25px", height: "25px" }} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
