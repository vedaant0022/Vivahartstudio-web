import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  background-color: #fff5f5;
  padding: 60px 0 30px;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #ffb6c1, #ffd1dc, #ffb6c1);
    
  }

  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 40px;
    margin-bottom: 50px;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
    }
  }

  .footer-column {
    h3 {
      font-size: 1.25rem;
      color: #333;
      margin-bottom: 20px;
      font-weight: 500;
      position: relative;
      display: inline-block;
      
      &:after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 0;
        width: 30px;
        height: 2px;
        background-color: #ffb6c1;
      }
    }

    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .social-links {
      display: flex;
      gap: 12px;

      a {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        transition: all 0.3s ease;
        border: 1px solid #eee;

        &:hover {
          background-color: #ffb6c1;
          color: white;
          transform: translateY(-3px);
        }

        svg {
          width: 18px;
          height: 18px;
        }
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        margin-bottom: 12px;

        a {
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;

          &:before {
            content: '♥';
            color: #ffb6c1;
            margin-right: 8px;
            font-size: 12px;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.3s ease;
          }

          &:hover {
            color: #ffb6c1;
            transform: translateX(5px);

            &:before {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      }
    }

    .newsletter {
      .input-group {
        display: flex;
        gap: 8px;

        input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #eee;
          border-radius: 25px;
          outline: none;
          transition: all 0.3s ease;

          &:focus {
            border-color: #ffb6c1;
            box-shadow: 0 0 0 3px rgba(255, 182, 193, 0.1);
          }
        }

        button {
          padding: 10px 24px;
          background-color: #ffb6c1;
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: #ff9aab;
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid #eee;
    padding-top: 20px;
    text-align: center;
    color: #666;
    font-size: 0.875rem;

    a {
      color: #ffb6c1;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .heart-decoration {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: #ffb6c1;
    opacity: 0.1;
    clip-path: path('M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z');
  }
`; 