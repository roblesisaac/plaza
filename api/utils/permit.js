const roles = ['public', 'member', 'admin', 'owner'];

export default function permit(allowedRoles) {
    return function (req, res, next) {
        const userRole = req.user ? req.user.role : 'public';

        const hasAccess = (role) => {
            const userRoleIndex = roles.indexOf(userRole);
            const requiredRoleIndex = roles.indexOf(role);
            return userRoleIndex !== -1 && userRoleIndex >= requiredRoleIndex;
        };

        if (Array.isArray(allowedRoles)) {
            if (allowedRoles.includes(userRole)) {
                return next();
            }
        } else if (typeof allowedRoles === 'string') {
            if (hasAccess(allowedRoles)) {
                return next();
            }
        } else {
            return res.status(500).json({ error: 'Invalid role specification' });
        }

        res.status(403).json({
            error: {
                message: `Access denied.`,
                your_role: userRole,
                required_roles: Array.isArray(allowedRoles) ? allowedRoles.join(', ') : allowedRoles
            }
        });
          
          
    };
}