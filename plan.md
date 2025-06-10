# Highway Billboard dApp Styling Fix Plan

## Current Status
- The application is running in dark mode
- Highway graphics and styling components are not displaying correctly
- There's a wallet functionality error with the "Start Engine" button
- The basic application structure remains intact

## What We've Investigated

1. **Component Code**
   - Verified that `DriveByMessages.tsx` and `PostMessageForm.tsx` contain the correct highway-themed styling code
   - Both components use the `COLORS` object from constants.ts correctly

2. **CSS Configuration**
   - Checked `globals.css` - contains proper Tailwind directives and custom highway theme styles
   - Fixed `postcss.config.mjs` to use `@tailwindcss/postcss` instead of `tailwindcss` (as required by Tailwind v4)
   - Verified `tailwind.config.js` has the highway theme colors and customizations

3. **Layout and Structure**
   - Confirmed `layout.tsx` is using the WalletProvider component and has highway theme styling
   - Verified `constants.ts` has the proper COLORS object defined

4. **File Structure**
   - Compared the `src` directory with the `highway-billboard/src` directory
   - Confirmed that the `move-files.sh` script simply copied files without modifications
   - Both directories have identical content for key files like `globals.css`

## Root Cause Analysis

After thorough investigation, we've identified several potential root causes:

1. **Tailwind CSS v4 Configuration**
   - The project is using Tailwind CSS v4, which has significant changes from v3
   - The PostCSS plugin has moved to a separate package (`@tailwindcss/postcss`)
   - Custom components defined in `@layer components` might not be processed correctly in v4

2. **Dark Mode Preference**
   - The `globals.css` file includes a media query for `prefers-color-scheme: dark`
   - This might be forcing dark mode regardless of other styling
   - The background gradient in the body style might be overriding custom backgrounds

3. **CSS Processing Order**
   - Tailwind's processing order might be affecting how custom styles are applied
   - The `@layer components` directive might not be working as expected in v4

4. **Missing Configuration**
   - While files were copied correctly, there might be missing configuration files
   - The build process might be using different settings than expected

5. **Wallet Functionality Error**
   - The wallet code is trying to use string methods (like `startsWith()`) on non-string values
   - This is causing a TypeError that prevents the "Start Engine" button from working
   - The error occurs in the account balance fetching functionality

## Action Plan

1. **Fix Dark Mode Override**
   - Modify the dark mode media query in `globals.css` to prevent it from forcing dark mode
   - Add a class-based dark mode toggle instead of using `prefers-color-scheme`

2. **Update Tailwind Configuration**
   - Ensure `tailwind.config.js` is properly configured for v4
   - Add explicit content paths to include all component files
   - Consider downgrading to Tailwind v3 if v4 issues persist

3. **Modify CSS Processing**
   - Move custom highway styles from `@layer components` to direct CSS classes
   - Use inline styles for critical highway elements as a temporary solution
   - Add `!important` to key styles to override any conflicting styles

4. **Fix Wallet Functionality**
   - Update the `useWallet` hook to handle non-string address values
   - Add type checking before using string methods
   - Ensure proper string conversion for wallet addresses

5. **Test Component Rendering**
   - Create a simplified test component with basic highway styling
   - Isolate styling issues by removing complex components
   - Add debug borders and backgrounds to verify component structure

6. **Build Process Fixes**
   - Clear the `.next` cache directory before rebuilding
   - Verify all dependencies are correctly installed
   - Check for any build warnings related to CSS processing

## Implementation Priority

1. First, fix the dark mode override in `globals.css`
2. Then update the Tailwind configuration for proper processing
3. Fix the wallet functionality to ensure the "Start Engine" button works
4. Test with simplified components to verify styling
5. Gradually reintroduce highway styling elements

## Next Steps

1. Modify `globals.css` to prevent dark mode from overriding highway styles
2. Update `tailwind.config.js` to ensure proper processing of custom components
3. Fix the wallet functionality in the `useWallet` hook
4. Create a test component with simplified highway styling
5. Clear build caches and rebuild the project