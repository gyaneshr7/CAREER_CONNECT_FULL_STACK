const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");
//Register

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    console.log("salt is: ");
    const hashPass = await bcrypt.hash(req.body.password, salt);
    console.log("password is: ");
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log("regisger err: " + err);
    res.status(500).json(err);
  }
});
//Login

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (!user) {
      // res.send("wrong credentials")
      return res.status(400).json("wrong credentials Here username");
    }
    const validated = await bcrypt.compare(req.body.password, user.password);

    if (!validated) {
      return res.status(400).json("wrong credentials Here Password");
    }
    const { password, ...others } = user._doc; //we dont send the password to the user
    res.status(200).json(others);
  } catch (err) {
    // res.send("wrong credentials")
    console.log("login err: " + err);
    res.status(500).json(err);
  }
});

module.exports = router;

// Salt is a random string which is concatenated or added in the password for extra security, which is then hashed. They are of fixed length, and are cryptographically strong. This is used to defend against attacks using precomputed hashes, using rainbow tables, etc.

// In this way, the password is more secure as the hash of real password is different from the hash of salted password.

// For example,

// Plaintext password =
// upvote_this_answer_NOW

// Salt = shklf87et6ehbg

// Salted password =
// upvote_this_answer_NOWshklf87et6ehbg
// Hashing with SHA-512 yeilds:

// Salted password’s hash =
// e10be86c2fc46dcf669d49f5f29e1dd7b1bf4e135f07cb4541e106ee0a591db6d5823187b1e88154775f2a9c1e3926eb88ee68f1d9bbedd372324185118c4a10

// Real password’s hash =
// fecf3e2c732cce39f056937cba78bbd4797b091865deb2eae88ef645cc167d353cf3d24163430268ba18c110e68c4b218eb369f341d82c334c673b464601443e
// Clearly, the hashes are different [shameless promotion password ik :)].

// If an attacker has a precomputed table of hashes of millions of passwords and tries to decrypt a database consisting of salted password hashes, he will fail, since the hashes are not the same.

// Even if he knows the salt (salt is generally stored in plaintext along with the hash), recomputing the table will take a good amount of time to make it not feasible.

// This way we have also avoided the problem of having the same hash for two different users, having the same passwords. Two passwords which are same will have different salts, so he would waste quite a lot of time on breaking very common passwords
/*
What is Salting?
Just as you add salt to enhance your food, a random string of characters (salt) is added to passwords to enhance them. Each user is assigned a different salt, which is only known to the server, making them unique and more secure. The salt can be placed on either side of the password. For example, adding salt to the password "Password" could result in a salted password like "4(j3Li95Password" or "Password4(j3Li95." After the salt is added, the combination of plaintext password and salt is then hashed, making it more secure than a hashed password alone.

 

Combining Salting and Hashing for Security
Password hashing makes storage and management more secure, and applies to both salted and unsalted passwords. Salted passwords that are also hashed make it harder for bad actors to crack passwords at scale. Because random characters are added to passwords prior to hashing, the hacker loses the ability to quickly figure out the plaintext password. Without guessing, it's almost impossible to take the output of a hash function and reverse it to find out the original value. The unique hash created with salted passwords defends against attack vectors, including dictionary, brute force and hash table attacks.

 

Let's say a hacker wants to test a password. The hacker first has to steal the server file containing hashed passwords. An experienced hacker will have already taken commonly used passwords, dictionary entries and passwords found on the dark web, run them through standard hash algorithms and put the results in a table. A hash table is a pre-calculated database of hashes and a rainbow table is a pre-calculated table of reversed hashes used to decipher password hashes. The hacker searches the server file for matches in the pre-calculated hashes on their rainbow table. Because the rainbow table was created from all the possible plaintexts, they now know that user's password. The hacker will be able to access the user's account unless other security measures, like multi-factor authentication (MFA), are in place.

 

A hacker with pre-calculated tables based on typical passwords will be unable to easily figure out salted passwords because random extra characters have been added. The hacker will be forced to try millions of hashed password-salt combinations in order to uncover passwords. Just as a car thief will skip difficult break-ins to find an unlocked car with the keys in the ignition, the hacker will move on to less secure targets.

 

Recap: Encryption vs. Hashing vs. Salting
Password encryption is used when the plaintext must be recovered for any reason. Encryption is a reversible method of converting plaintext passwords to ciphertext, and you can return to the original plaintext with a decryption key. Encryption is often used for storing passwords in password managers.

 

Password hashing is useful on the server side when server operators don't need to know the plaintext, only that the user knows the plaintext. Hashing is a one-way process that converts a password to ciphertext using hash algorithms. A hashed password cannot be decrypted, but a hacker can try to reverse engineer it.

 

Password salting adds random characters before or after a password prior to hashing to obfuscate the actual password. Because of the randomness of the salt, hackers have a very difficult time figuring out actual passwords from hashed salted passwords because their pre-calculated tables of passwords won't work.
*/
