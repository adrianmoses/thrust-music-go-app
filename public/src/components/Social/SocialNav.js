import React from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';

const styles = {
    nav: {
        marginTop: "10px",
        marginBottom: "15px",
        height: "40px"
    }
}

export default class SocialNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [
                {
                    provider: 'twitter',
                    profileImageUrl: '',
                    isConnected: false
                },
                {
                    provider: 'facebook',
                    profileImageUrl: '',
                    isConnected: false
                },
                {
                    provider: 'youtube',
                    profileImageUrl: '',
                    isConnected: false
                },
            ],
        }
    }
    toggleConnectView() {
      if (this.props.hidden) {
        this.props.showConnectView(); 
      } else {
        this.props.hideConnectView();
      }
    }
    render() {
        let accountNav = this.props.accounts.map((account) => {
            let profileImageUrl = account.profile_image_url
            if (!profileImageUrl) {
                profileImageUrl = "https://api.adorable.io/avatars/25/1jlr39.png"
            }
            let isSelected = account.provider === this.props.selectedProvider;
            let _classes = classNames('social-account-img', {
                'selected': isSelected,
            })
            return (
                <div 
                    className={_classes} 
                    onClick={(e) => this.props.updateActiveItem(e, account.provider)}
                    style={{
                        background: `url(${profileImageUrl})`,
                        backgroundSize: 'cover'
                    }}>
                    <i className={"social-account-icon smfi " + account.provider + "-white-icon " + account.provider} />
                </div>
            )
        })
        return (
            <div style={styles.nav}>
                {accountNav}
                <Tooltip placement="topRight" title="Connect Social Account">
                    <div 
                        onClick={(e) => this.toggleConnectView()}
                        className="social-account-new">
                        <i className="bfi add" />
                    </div>
                </Tooltip>
            </div>
        )
    }
}