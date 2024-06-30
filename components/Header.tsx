import { NAV_MENU } from '@/constants';
import MenuItem from './MenuItem';

export default function Header() {
  return (
    <div className="flex items-center justify-between w-full p-4 border-b border-gray-200">
      <div>Logo</div>
      <div className="flex items-center gap-16 text-lg px-2">
        {NAV_MENU.map((menu) => (
          <MenuItem key={menu.label} menu={menu} />
        ))}
      </div>
    </div>
  );
}
