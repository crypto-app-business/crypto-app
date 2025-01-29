'use client';
import Image from 'next/image';

export default function Header({isSidebarOpen, toggleSidebar}) {

  return (
    <header className="bg-[url('/header.png')] bg-cover text-white max-h-[125px] shadow-md p-4 flex justify-between items-center">
      <div className='flex justify-between w-full max-w-[1149px] mr-auto ml-auto'
        // style={{
        //   background: 'linear-gradient(90.00deg, rgba(41, 57, 84, 0) 38.6%,rgba(41, 57, 84, 0.5) 100%)',
        // }}
        
        // background: linear-gradient(90.00deg, rgba(41, 57, 84, 0) 38.6%,rgba(41, 57, 84, 0.5) 100%);

      >
        <div className='flex gap-[20px] items-center'>
          <Image
            src="/logo.png"
            alt="Your image description" 
            width={83} 
            height={66} 
            objectFit="cover"
            priority={false}
          />
        </div>
          <div className='flex items-center gap-[10px] justify-end'>
            <button className="flex items-center justify-center gap-2 px-[3px] py-[2px]  text-black hover:bg-gray-600">
              <Image
                src="/dashboard/globe.svg"
                alt="Your image description" 
                width={45} 
                height={45} 
                objectFit="cover"
                priority={false}
              />
            </button>
            <div className="relative">
              <button className="flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600">
                <Image
                  src="/dashboard/bell.svg"
                  alt="Your image description" 
                  width={45} 
                  height={45} 
                  objectFit="cover"
                  priority={false}
                />
              </button>
              <span className="absolute top-0 right-0 flex items-center justify-center w-[25px] h-[25px] bg-white text-[#00163A] text-[16px] text-bold  rounded-full">
                2
              </span>
            </div>
            <button className="flex items-center justify-center rounded-full hover:bg-gray-600">
              <Image
                src="/dashboard/contacts.svg"
                alt="Your image description" 
                width={45} 
                height={45} 
                objectFit="cover"
                priority={false}
              />
            </button>
            { !isSidebarOpen && <div onClick={toggleSidebar} className={"sm:hidden"}>
              <Image
                src="/dashboard/menu.svg"
                alt="Your image description" 
                width={45} 
                height={45} 
                objectFit="cover"
                priority={false}
              />
            </div>}
          </div>
        </div>
    </header>
  );
}
