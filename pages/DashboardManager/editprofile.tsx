import dynamic from "next/dynamic";
import Image from "next/image";
import { useContext } from "react";
import LayoutDashboardManager from "../../components/Dashboard/LayoutDashboardManager";
import { Store } from "../../utils/Store";

const EditProfile = () => {
   const { state, dispatch } = useContext(Store);
   const { agencyInfo } = state;
   return (
      <LayoutDashboardManager title="Edit profile">
         <div className="">
            <div className="font-semibold text-xl mt-8">
               Edit profile agency
            </div>
            <div className="grid grid-cols-12 gap-8 mx-16 mt-10">
               <div className="col-span-4 bg-light-primary dark:bg-dark-primary rounded-lg p-10 h-fit">
                  <div className="relative rounded-xl overflow-hidden aspect-square">
                     <Image
                        src={agencyInfo.avatar}
                        alt=""
                        layout="fill"
                        className=""
                     />
                  </div>
                  <div className="font-semibold text-lg text-center mt-4">
                     Avatar
                  </div>
               </div>
               <div className="col-span-8 bg-light-primary dark:bg-dark-primary rounded-lg">
                  <div className="grid grid-cols-12 gap-4 font-semibold p-6">
                     <div className="col-span-12">
                        <label htmlFor="name">Name</label>
                        <input
                           type="text"
                           name=""
                           id="name"
                           className="p-4 rounded-lg w-full"
                           defaultValue={agencyInfo.name}
                        />
                     </div>
                     <div className="col-span-12">
                        <label htmlFor="hotline">Hotline</label>
                        <input
                           type="text"
                           name=""
                           id="hotline"
                           className="p-4 rounded-lg w-full"
                           defaultValue={agencyInfo.hotline}
                        />
                     </div>
                     <div className="col-span-12">
                        <label htmlFor="address">Address</label>
                        <input
                           type="text"
                           name=""
                           id="address"
                           className="p-4 rounded-lg w-full"
                           defaultValue={agencyInfo.address}
                        />
                     </div>
                     <div className="col-span-12">
                        <label htmlFor="fields" className="">
                           Field
                        </label>
                        <select
                           name="fields"
                           id="fields"
                           className="p-4 rounded-lg dark:bg-dark-primary w-full"
                           defaultValue={agencyInfo.field.id}
                           //   onChange={(e) => {
                           //      setField(Number(e.target.value));
                           //   }}
                        >
                           <option value={1}>Thời trang</option>
                           <option value={2}>Dược phẩm</option>
                           <option value={3}>Đồ gia dụng</option>
                           <option value={4}>Đồ handmade - Mỹ nghệ</option>
                           <option value={5}>Thực phẩm</option>
                           <option value={6}>Phụ kiện công nghệ</option>
                           <option value={7}>Đồ chơi trẻ emc</option>
                           <option value={8}>Phụ kiện - Trang sức</option>
                           <option value={9}>Sách</option>
                           <option value={10}>Văn phòng phẩm</option>
                           <option value={11}>Chăm sóc thú cưng</option>
                           <option value={12}>Thể thao - Du lịch</option>
                           <option value={13}>
                              Mỹ phẩm - Chăm sóc sắc đẹp
                           </option>
                           <option value={14}>Dịch vụ</option>
                           <option value={15}>Xe - Phụ kiện xe</option>
                           <option value={16}>Khác</option>
                        </select>
                     </div>
                     <div className="col-span-12 text-right">
                        <button className="p-4 bg-blue-main text-white rounded-lg">
                           Save changes
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </LayoutDashboardManager>
   );
};

// export default EditProfile;
export default dynamic(() => Promise.resolve(EditProfile), { ssr: false });
