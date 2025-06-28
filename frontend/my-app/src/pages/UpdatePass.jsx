import React , {useState} from 'react'

const UpdatePass = () => {

    const [oldPass , setOldPass] = useState("")
    const [newPass , setNewPass] = useState("")
    const [confirmPass , setConfirmPass] = useState("")
  return (
    <div className="h-screen w-screen bg-gray-900  flex flex-col justify-center items-center">
      <h1>Update Password</h1>
      <form action="submit" className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="oldPass">Old password</label>
          <input
            type="password"
            name="oldPass"
            placeholder="old password"
            value={oldPass}
            onChange={(e)=> setOldPass(e.target.value)}
            className="border-gray-700 border-2 rounded-md px-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="newPass">new password</label>
          <input
            type="password"
            name="newPass"
            placeholder="new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="border-gray-700 border-2 rounded-md px-2"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="newPass">confirm new password</label>
          <input
            type="password"
            name="confirmPass"
            placeholder="confirm password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="border-gray-700 border-2 rounded-md px-2"
          />
        </div>
      </form>
    </div>
  );
}

export default UpdatePass