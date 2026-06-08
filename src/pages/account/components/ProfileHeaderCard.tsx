import React from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ProfileHeaderCardProps {
  name: string;
  email: string;
  role: string;
  memberSince?: string;
  onEditClick?: () => void;
  className?: string;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  name,
  email,
  role,
  memberSince,
  onEditClick,
  className,
}) => {
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3678ba] to-[#3d82c4] p-5 lg:p-6',
        className
      )}
    >
      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 right-8 w-20 h-20 bg-white/5 rounded-full translate-y-1/2" />
      
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 border-3 border-white/40 shadow-lg">
          {getInitials(name)}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-white/80 text-sm mt-0.5">{email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white backdrop-blur-sm">
              {role}
            </span>
            {memberSince && (
              <span className="text-white/60 text-xs">
                Thành viên từ {memberSince}
              </span>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 font-medium text-sm backdrop-blur-sm hover:shadow-md"
        >
          <Pencil size={16} />
          <span>Chỉnh sửa</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
