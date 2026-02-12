const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Création d'utilisateur
exports.createUser = async (req, res) => {
    const { fullName, email, password, role, phone } = req.body;

    try {
        // Vérifier que tous les champs nécessaires sont remplis
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "Tous les champs requis ne sont pas remplis" });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "L'utilisateur existe déjà" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            phone,
        });

        res.status(201).json({
            message: "Création réussie",
            data: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phone },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
};

// Connexion de l'utilisateur
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Comparer le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }

        // Créer un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Connexion réussie",
            data: {
            token,
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, phone: user.phone }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la connexion de l'utilisateur" });
    }
};

// MOT DE PASSE OUBLIÉ - NOUVELLE FONCTION
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                message: 'L\'adresse email est requise' 
            });
        }

        // Vérifier si l'utilisateur existe (avec Sequelize)
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        
        if (!user) {
            return res.status(404).json({ 
                message: 'Aucun compte associé à cette adresse email' 
            });
        }

        // Générer un token de réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

        // Sauvegarder le token (avec Sequelize)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Configuration du transporteur email
        let transporter;
        
        if (process.env.NODE_ENV === 'development') {
            // Configuration pour le développement
            if (process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS) {
                transporter = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: process.env.MAILTRAP_USER,
                        pass: process.env.MAILTRAP_PASS
                    }
                });
                console.log('📧 Utilisation de Mailtrap pour les emails de dev');
            } else {
                // Utiliser Ethereal (auto-génère des credentials)
                const testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                console.log('📧 Utilisation d\'Ethereal:', testAccount.user);
                console.log('🔗 Voir les emails sur: https://ethereal.email');
            }
        } else {
            // Configuration pour la production
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        }

        // URL de réinitialisation
        const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        // Options de l'email
        const mailOptions = {
            from: process.env.NODE_ENV === 'development' 
                ? 'noreply@votre-app.com' 
                : process.env.EMAIL_USER,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #3B82F6;">Réinitialisation de mot de passe</h2>
                    <p>Bonjour ${user.fullName},</p>
                    <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
                    <div style="margin: 20px 0;">
                        <a href="${resetURL}" 
                           style="background-color: #3B82F6; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            Réinitialiser mon mot de passe
                        </a>
                    </div>
                    <p><strong>⏰ Ce lien expire dans 1 heure.</strong></p>
                    <p style="color: #666; font-size: 14px;">
                        Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.
                    </p>
                    
                    ${process.env.NODE_ENV === 'development' ? 
                        `<div style="background: #f3f4f6; padding: 10px; border-radius: 4px; margin: 20px 0;">
                            <strong>MODE DEV:</strong><br>
                            Token: ${resetToken}<br>
                            URL: ${resetURL}
                        </div>` 
                        : ''}
                </div>
            `
        };

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);

        // Log pour le développement
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Email envoyé!');
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
            console.log('🔑 Reset Token:', resetToken);
            console.log('🔗 Reset URL:', resetURL);
        }

        res.status(200).json({
            success: true,
            message: 'Email de réinitialisation envoyé avec succès',
            // En dev, on peut retourner des infos utiles
            ...(process.env.NODE_ENV === 'development' && {
                devInfo: {
                    previewUrl: nodemailer.getTestMessageUrl(info),
                    resetToken: resetToken,
                    resetURL: resetURL
                }
            })
        });

    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'envoi de l\'email',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// VALIDATION DU TOKEN (optionnelle - pour vérifier si le token est encore valide)
exports.validateResetToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ 
                message: 'Token requis' 
            });
        }

        // Vérifier si le token existe et n'est pas expiré
        const user = await User.findOne({ 
            where: { 
                resetPasswordToken: token,
                resetPasswordExpiry: {
                    [require('sequelize').Op.gt]: new Date() // Token non expiré
                }
            } 
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Token invalide ou expiré' 
            });
        }

        res.status(200).json({
            success: true,
            message: 'Token valide',
            user: {
                email: user.email,
                fullName: user.fullName
            }
        });

    } catch (error) {
        console.error('❌ Erreur validation token:', error);
        res.status(500).json({
            message: 'Erreur lors de la validation du token'
        });
    }
};

// RÉINITIALISATION DU MOT DE PASSE (pour compléter le processus)
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ 
                message: 'Token et nouveau mot de passe requis' 
            });
        }

        // Trouver l'utilisateur avec le token valide
        const user = await User.findOne({ 
            where: { 
                resetPasswordToken: token,
                resetPasswordExpiry: {
                    [require('sequelize').Op.gt]: new Date() // Token non expiré
                }
            } 
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Token invalide ou expiré' 
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe et supprimer le token
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur reset password:', error);
        res.status(500).json({
            message: 'Erreur lors de la réinitialisation du mot de passe'
        });
    }
};

// ROUTE DE TEST EMAIL (optionnelle)
exports.testEmail = async (req, res) => {
    try {
        // Créer un compte de test automatiquement
        const testAccount = await nodemailer.createTestAccount();
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const info = await transporter.sendMail({
            from: '"Test App" <test@example.com>',
            to: 'test@example.com',
            subject: 'Test Email Configuration',
            html: '<h1>✅ Email fonctionne!</h1><p>Votre configuration email est OK.</p>'
        });

        res.json({
            success: true,
            message: 'Email de test envoyé',
            previewUrl: nodemailer.getTestMessageUrl(info)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur configuration email',
            error: error.message
        });
    }
};

// ... (gardez toutes vos autres méthodes existantes)

// Mise à jour de l'utilisateur
exports.updateOwnProfile = async (req, res) => {
  const userId = req.user.id;
  const { fullName, email, phone } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Mise à jour uniquement des champs autorisés
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil" });
  }
};

// Suppression de l'utilisateur
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Supprimer l'utilisateur
        await user.destroy();

        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
};

// Récupération de tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'fullName', 'email', 'role', 'phone'], // Limiter les attributs pour des raisons de sécurité
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }

        res.status(200).json({
            message: "Utilisateurs récupérés avec succès",
            data: users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};

// Récuperation d'un utilisateur via id
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(id, {
            attributes: ['id', 'fullName', 'email', 'role', 'phone'], // Limiter les attributs pour des raisons de sécurité
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            message: "Utilisateur récupéré avec succès",
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }
}

// Pour l'utilisateur lui-même (route profil)
exports.updateMyProfile = async (req, res) => {
    // L'ID de l'utilisateur vient du token (attaché par authenticateToken)
    const userId = req.user.id;
    const updates = req.body;

    // Optionnel: Filtrer les champs que l'utilisateur peut modifier (ex: il ne peut pas changer son rôle)
    const allowedUpdates = {};
    if (updates.email) allowedUpdates.email = updates.email;
    if (updates.password) allowedUpdates.password = updates.password;
    if (updates.firstName) allowedUpdates.firstName = updates.firstName;
    if (updates.lastName) allowedUpdates.lastName = updates.lastName;
    // ... ajoutez tous les champs que l'utilisateur est autorisé à modifier

    // Si le mot de passe est mis à jour, assurez-vous de le hasher avant de le sauvegarder
    if (allowedUpdates.password) {
        // Implémentez votre logique de hachage de mot de passe ici (ex: bcrypt)
        // allowedUpdates.password = await bcrypt.hash(allowedUpdates.password, 10);
    }

    try {
        const [updatedRowsCount, updatedUsers] = await User.update(allowedUpdates, {
            where: { id: userId },
            returning: true
        });

        if (updatedRowsCount === 0) {
            // Très peu probable si req.user.id est valide, mais bonne pratique
            return res.status(404).json({ message: "Profil utilisateur non trouvé." });
        }

        // Optionnel: Nettoyer l'objet utilisateur avant de le renvoyer (ne pas renvoyer le mot de passe hashé)
        const updatedUser = updatedUsers[0].toJSON(); // Pour Sequelize
        delete updatedUser.password;

        res.status(200).json({ message: "Profil mis à jour avec succès.", user: updatedUser });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        res.status(500).json({ error: "Erreur serveur lors de la mise à jour du profil." });
    }
};

exports.getOwnProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'phone', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès",
      user: user
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.changeOwnPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteOwnAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    await user.destroy();
    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteOwnAccount :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({ message: "Utilisateur mis à jour", data: user });
  } catch (error) {
    console.error("Erreur updateUserByAdmin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Compter le nombre total d'utilisateurs
exports.countUsers = async (req, res) => {
  try {
    const total = await User.count();
    res.status(200).json({ totalUsers: total });
  } catch (error) {
    console.error("Erreur countUsers :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};