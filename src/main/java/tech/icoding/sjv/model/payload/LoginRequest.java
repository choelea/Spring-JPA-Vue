/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package tech.icoding.sjv.model.payload;

import com.fasterxml.jackson.annotation.JsonIgnore;
import tech.icoding.sjv.model.DeviceType;
import tech.icoding.sjv.validation.annotation.NullOrNotBlank;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.NotNull;

@Schema(name = "Login Request", description = "The login request payload")
public class LoginRequest {

    @NullOrNotBlank(message = "Login Username can be null but not blank")
//    @Schema(name = "Registered username", allowableValues = "NonEmpty String")
    private String username;

//    @NullOrNotBlank(message = "Login Email can be null but not blank")
//    @Schema(name = "User registered email", required = true, allowableValues = "NonEmpty String")
    @JsonIgnore
    private String email;

    @NotNull(message = "Login password cannot be blank")
//    @Schema(name = "Valid user password", required = true, allowableValues = "NonEmpty String")
    private String password;

//    @Valid
//    @NotNull(message = "Device info cannot be null")
//    @Schema(name = "Device info", required = true, type = "object", allowableValues = "A valid deviceInfo object")
    @JsonIgnore
    private DeviceInfo deviceInfo = new DeviceInfo("mockDeviceId", DeviceType.DEVICE_TYPE_UNKNOWN, null);

    public LoginRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.deviceInfo = new DeviceInfo("mockDeviceId", DeviceType.DEVICE_TYPE_UNKNOWN, null);;
    }

    public LoginRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public DeviceInfo getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(DeviceInfo deviceInfo) {
        this.deviceInfo = deviceInfo;
    }
}
