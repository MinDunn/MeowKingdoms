import React, { useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthManager: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showNaming, setShowNaming] = useState(false);
  const [email, setEmail] = useState(''); // This acts as Username/Login ID
  const [recoveryEmail, setRecoveryEmail] = useState(''); // Real email for recovery
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load remembered credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  const validateName = (val: string) => {
    if (val.length > 0 && val.length < 10) return 'Tên cần tối thiểu 10 ký tự';
    if (val.length > 20) return 'Tên tối đa 20 ký tự';
    if (/[^a-zA-Z0-9]/.test(val)) return 'Không sử dụng ký tự đặc biệt';
    return '';
  };

  const handleAuthSuccess = async (user: any) => {
    // SUPER ADMIN BYPASS
    if (user.email === 'admintest123@meow.kingdom') {
      const docRef = doc(db, 'players', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid, displayName: 'Master Admin', email: user.email,
          level: 999, exp: 0, avatar: '👑', status: 'active', role: 'admin',
          createdAt: serverTimestamp(),
          inventory: { currencies: { gold: 999999, diamond: 999999, summon_ticket: 999 }, materials: {}, heroes: [], items: [] }
        });
      }
      return; // Skip naming screen
    }

    const docRef = doc(db, 'players', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || !docSnap.data()?.displayName) {
      setTempUser(user);
      setShowNaming(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      let loginEmail = email;
      if (!email.includes('@')) {
        loginEmail = `${email}@meow.kingdom`;
      }

      if (isLogin) {
        const res = await signInWithEmailAndPassword(auth, loginEmail, password);
        
        // Handle Remember Me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        await handleAuthSuccess(res.user);
      } else {
        const res = await createUserWithEmailAndPassword(auth, loginEmail, password);
        // Store recovery email in Firestore later
        await setDoc(doc(db, 'players', res.user.uid), {
          recoveryEmail: recoveryEmail,
          loginId: email
        }, { merge: true });
        
        setTempUser(res.user);
        setShowNaming(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await handleAuthSuccess(res.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const vError = validateName(name);
    if (vError || name.length < 10) return;
    setLoading(true);
    try {
      await updateProfile(tempUser, { displayName: name });
      await setDoc(doc(db, 'players', tempUser.uid), {
        uid: tempUser.uid,
        displayName: name,
        email: tempUser.email,
        level: 1, exp: 0, avatar: '🐱', status: 'active', role: 'user',
        createdAt: serverTimestamp(),
        inventory: { currencies: { gold: 500, diamond: 50, summon_ticket: 5 }, materials: {}, heroes: [], items: [] }
      }, { merge: true });
      setShowNaming(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showNaming) {
    const vError = validateName(name);
    return (
      <div className="auth-container animate-in">
        <div className="manga-card auth-card animate-pop" style={{borderColor: 'var(--p-orange)'}}>
          <div className="auth-header">
            <div className="hero-avatar-static" style={{margin: '0 auto 20px'}}>🎭</div>
            <h1>Danh Tính Anh Hùng</h1>
            <p>Tên của bạn sẽ lưu danh sử sách vương quốc!</p>
          </div>
          <form onSubmit={handleSaveName} className="auth-form">
            <div className="form-group">
              <label>TÊN HIỂN THỊ (10-20 KÝ TỰ)</label>
              <div style={{position:'relative'}}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="MeowHero99..." className={vError ? 'input-error' : ''} style={{paddingRight:'40px'}} />
                <span style={{position:'absolute', right:'15px', top:'50%', transform:'translateY(-50%)'}}>{name.length >= 10 && !vError ? '✅' : '❌'}</span>
              </div>
              {vError && <p className="validation-msg error">{vError}</p>}
            </div>
            <button type="submit" className="btn-cute auth-submit" disabled={!!vError || name.length < 10 || loading}>
              {loading ? 'Khởi tạo vương quốc...' : 'Bắt Đầu Hành Trình 🐾'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container animate-in">
      <div className="manga-card auth-card animate-pop">
        <div className="auth-header">
          <div className="auth-logo-container">
            <img src="/meow-logo.png" alt="Meow Kingdoms" className="auth-logo-img" />
          </div>
          <h1>Meow Kingdoms</h1>
          <p>{isLogin ? 'Chào mừng Anh Hùng trở lại!' : 'Khởi tạo hành trình huyền thoại'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>TÊN ĐĂNG NHẬP</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập tên đăng nhập (ID)..." required />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label>EMAIL KHÔI PHỤC</label>
              <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} placeholder="email@gmail.com" required />
            </div>
          )}

          <div className="form-group">
            <label>MẬT KHẨU</label>
            <div style={{position: 'relative'}}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                className="btn-toggle-pw" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="auth-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={e => setRememberMe(e.target.checked)} 
                />
                Lưu tài khoản
              </label>
              <button type="button" className="auth-toggle" style={{fontSize: '0.85rem', textDecoration: 'none'}}>
                Quên mật khẩu?
              </button>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>XÁC NHẬN MẬT KHẨU</label>
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
          )}

          {error && <div className="auth-error">❌ {error}</div>}
          <button type="submit" className="btn-cute auth-submit" disabled={loading}>
            {loading ? '⏳ Đang xử lý...' : (isLogin ? 'Vào Vương Quốc 🗝️' : 'Khởi Tạo Tài Khoản ✨')}
          </button>
        </form>

        {isLogin && (
          <div className="google-auth-area" style={{marginTop: '30px'}}>
            <div className="auth-divider"><span>HOẶC ĐĂNG NHẬP NHANH</span></div>
            <button onClick={handleGoogleLogin} className="btn-google" disabled={loading}>
              <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="G" />
              Tiếp tục với Google
            </button>
          </div>
        )}

        <div className="auth-footer">
          <p>{isLogin ? 'Bạn là lính mới?' : 'Đã có danh tính?'}</p>
          <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Đăng ký ngay' : 'Quay lại đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthManager;
