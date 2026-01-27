# Aviator Frontend - React/Vite

A professional React implementation of the Aviator crash game frontend, integrated with the backend API.

## Project Structure

```
src/
├── api/                    # API Integration Layer
│   ├── axios.js           # Axios instance with interceptors
│   ├── auth.js            # Authentication API calls
│   ├── wallet.js          # Wallet/Balance API calls
│   └── aviator.js         # Game logic API calls
├── context/               # React Context for State Management
│   ├── AuthContext.jsx    # Auth state (user, login, logout)
│   └── GameContext.jsx    # Game state (rounds, bets, balance)
├── hooks/                 # Custom React Hooks
│   ├── useAuth.js         # Auth context hook
│   └── useGame.js         # Game context hook
├── components/            # Reusable React Components
│   ├── BetPanel.jsx       # Betting interface
│   ├── BetHistory.jsx     # Recent bets display
│   ├── MultiplierGraph.jsx # Canvas-based graph animation
│   ├── MultiplierDisplay.jsx # Current multiplier display
│   ├── CashoutButton.jsx  # Manual cashout button
│   ├── NetworkStatus.jsx  # Connection indicator
│   └── ProtectedRoute.jsx # Route guard for auth
├── pages/                 # Full Page Components
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # Registration page
│   └── Aviator.jsx        # Main game page
├── App.jsx                # Main app with routing
└── main.jsx               # React entry point
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd aviatorfrontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your backend URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will be available at `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   ```

## Features

### Authentication
- Phone number & password registration
- Login with JWT token storage
- Automatic token injection in API requests
- 401 error handling (auto-redirect to login)

### Game Integration
- Real-time round polling (300-500ms intervals)
- Live multiplier animation
- Bet placement with auto-cashout
- Bet history tracking
- Balance display and updates

### UI/UX
- Dark theme with Tailwind CSS
- Responsive design (mobile & desktop)
- Network status indicator
- Real-time error messages
- Loading states on all actions

## API Integration Details

### Backend Base URL
Set via `VITE_API_BASE_URL` environment variable. Default: `http://localhost:8000`

### Endpoints Used

**Authentication:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

**Wallet:**
- `GET /wallet/balance` - Get user balance
- `POST /wallet/deposit/stk` - Initiate M-Pesa deposit
- `POST /wallet/withdraw/mpesa` - Withdraw funds

**Game:**
- `GET /aviator/round` - Get current round status (polled)
- `POST /aviator/bet` - Place a bet
- `POST /aviator/cashout/{betId}` - Manual cashout
- `GET /aviator/bets` - Get bet history
- `GET /aviator/bets/current` - Get active bets

### Token Management
JWT tokens are:
- Stored in `localStorage` after login
- Automatically included in all API requests
- Cleared on logout or 401 error

## State Management

### AuthContext
Manages:
- User authentication state
- Login/Register/Logout operations
- Error messages
- Loading states

Usage:
```javascript
const { user, isAuthenticated, login, logout } = useAuth();
```

### GameContext
Manages:
- Current round data
- Wallet balance
- Active and historical bets
- Game multiplier animation
- Bet placement and cashout

Usage:
```javascript
const { balance, gameStatus, multiplier, placeBet } = useGame();
```

## Key Implementation Notes

### Multiplier Animation
- Frontend simulates visual multiplier increment (0.06 per 100ms)
- Backend controls actual crash point and results
- Frontend respects backend state for wins/losses

### Polling Strategy
- `/aviator/round` polled every 400ms
- Maintains real-time round status
- Game status: `open`, `running`, `crashed`, `closed`

### Betting Rules (Enforced Frontend)
- Only allow bets when status is `open`
- Minimum bet: 100 KSH
- Maximum bet: 50,000 KSH
- Balance validation before placement

### Error Handling
- Network errors display in UI
- 401 errors trigger automatic redirect
- User-friendly error messages from backend

## Development Guidelines

### Adding New Features
1. **API calls:** Add to `src/api/` files
2. **State:** Use existing contexts or create new ones
3. **Components:** Create in `src/components/`
4. **Pages:** Add to `src/pages/`

### Component Best Practices
- Use custom hooks (`useAuth`, `useGame`)
- Handle loading and error states
- Disable UI during API calls
- Validate user input before submission

## Troubleshooting

### Backend Connection Issues
- Verify `VITE_API_BASE_URL` in `.env`
- Check backend is running on the specified port
- Check CORS settings in backend

### Token Issues
- Clear browser storage: `localStorage.clear()`
- Re-login to get new token
- Check backend JWT configuration

### Game Not Loading
- Check browser console for errors
- Verify backend API is responding
- Check network tab in DevTools

## Production Deployment

1. **Build:**
   ```bash
   npm run build
   ```

2. **Configure backend URL:**
   ```bash
   VITE_API_BASE_URL=https://api.yourdomain.com npm run build
   ```

3. **Deploy `dist/` folder** to your hosting service

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations
- Canvas rendering optimized for smooth animations
- Debounced polling to reduce server load
- Efficient state updates using React hooks
- Lazy loading via code splitting (if needed)

## Security Notes
- JWT tokens stored in localStorage
- CORS requests to backend
- No sensitive data stored locally
- Auto-logout on 401 (expired token)

## Support & Issues
For issues or questions about the frontend integration, refer to the backend integration manual or contact the development team.
